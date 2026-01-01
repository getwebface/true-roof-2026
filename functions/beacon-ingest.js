import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle all requests (POST and OPTIONS) to this route
export const onRequest = async ({ request, env }) => {
  // 1. Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    });
  }

  // 2. Only accept POST requests for actual processing
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      headers: corsHeaders,
      status: 405 
    });
  }

  try {
    const data = await request.json();
    
    // 3. Validate required fields
    if (!data.sessionId || !data.events || !Array.isArray(data.events)) {
      return new Response('Invalid request: missing sessionId or events array', { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      });
    }

    // 4. Initialize Supabase client
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response('Server configuration error', { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 5. Process session data
    const sessionData = {
      session_id: data.sessionId,
      user_agent: data.metadata?.userAgent || null,
      referrer: data.metadata?.referrer || null,
      landing_page: data.events[0]?.pageUrl || request.headers.get('Referer') || 'unknown',
      device_type: getDeviceType(data.metadata?.userAgent),
      screen_resolution: data.metadata?.screenResolution || null,
      language: data.metadata?.language || null,
      country_code: request.cf?.country || null,
      created_at: new Date().toISOString()
    };

    // Insert or update session
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .upsert(sessionData, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      console.error('Session upsert error:', sessionError);
    }

    // 6. Process events in batches
    const batchSize = 50;
    const eventBatches = [];
    
    for (let i = 0; i < data.events.length; i += batchSize) {
      eventBatches.push(data.events.slice(i, i + batchSize));
    }

    const eventPromises = eventBatches.map(async (batch) => {
      const eventsToInsert = batch.map(event => ({
        session_id: data.sessionId,
        event_type: event.eventType,
        element_path: event.elementPath || null,
        element_type: event.elementType || null,
        element_text: event.elementText || null,
        coordinates: event.coordinates || null,
        viewport_size: event.viewportSize || null,
        event_data: event.eventData || {},
        timestamp: new Date(event.timestamp).toISOString(),
        page_url: event.pageUrl,
        component_id: event.componentId || null,
        metadata: {
          user_agent: data.metadata?.userAgent,
          screen_resolution: data.metadata?.screenResolution,
          language: data.metadata?.language,
          timezone: data.metadata?.timezone,
          page_load_time: data.metadata?.pageLoadTime || 0
        }
      }));

      const { error: eventsError } = await supabase
        .from('behavior_events')
        .insert(eventsToInsert);

      if (eventsError) {
        console.error('Events insert error:', eventsError);
        throw eventsError;
      }
    });

    // 7. Process conversion events separately
    const conversionEvents = data.events.filter(e => e.eventType === 'conversion_step');
    if (conversionEvents.length > 0) {
      const conversionPromises = conversionEvents.map(async (event) => {
        const { error: conversionError } = await supabase
          .from('conversion_funnels')
          .upsert({
            session_id: data.sessionId,
            funnel_name: event.eventData.funnelName,
            step_name: event.eventData.stepName,
            step_order: event.eventData.stepOrder,
            entered_at: new Date(event.timestamp).toISOString(),
            metadata: event.eventData
          }, {
            onConflict: 'session_id,funnel_name,step_order'
          });

        if (conversionError) {
          console.error('Conversion insert error:', conversionError);
        }
      });

      await Promise.allSettled(conversionPromises);
    }

    // Wait for all event batches
    await Promise.allSettled(eventPromises);

    // 8. Process Session End
    const sessionEndEvent = data.events.find(e => e.eventType === 'session_end');
    if (sessionEndEvent) {
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({
          exit_page: sessionEndEvent.pageUrl,
          exit_reason: 'navigation',
          duration_seconds: Math.floor(sessionEndEvent.eventData.durationMs / 1000),
          page_count: sessionEndEvent.eventData.pageCount,
          updated_at: new Date().toISOString()
        })
        .eq('session_id', data.sessionId);

      if (updateError) {
        console.error('Session update error:', updateError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: data.events.length,
      sessionId: data.sessionId 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Beacon ingestion error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
};

// Helper function
function getDeviceType(userAgent) {
  if (!userAgent) return 'desktop';
  
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}
