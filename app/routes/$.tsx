import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import DynamicPageRenderer from "~/components/DynamicPageRenderer";
import { validatePageSections } from "~/components/registry";
import type { GlobalSiteData } from "~/types/sdui";

// Simple hash function for session-based variant assignment
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Deep merge function for combining variant JSON with base sections
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export async function loader({ params, context, request }: Route.LoaderArgs) {
  // Get environment variables from Cloudflare context or process
  const env = (context as any).cloudflare?.env || process.env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  // Normalize slug: if empty or undefined, use "/"
  let slug = params["*"] || "/";
  if (slug !== "/" && slug.endsWith("/")) slug = slug.slice(0, -1);
  if (slug === "") slug = "/";

  // Check cache headers from request
  const cacheKey = `page:${slug}`;
  const cacheControl = request.headers.get('Cache-Control') || 'public, max-age=60, stale-while-revalidate=300';
  
  // Fetch page data
  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (pageError || !pageData) {
    console.error("Supabase Error for slug [" + slug + "]:", pageError);
    return { page: null, sections: null, siteData: null, error: "No data found for slug: " + slug };
  }

  // Parse base sections
  let sections = {};
  try {
    sections = typeof pageData.content_sections === 'string' 
      ? JSON.parse(pageData.content_sections) 
      : pageData.content_sections;
  } catch (parseError) {
    console.error("JSON Parse Error for sections:", parseError);
    return { page: null, sections: null, siteData: null, error: "Malformed content_sections JSON" };
  }

  // Check for active A/B tests for this page
  const { data: activeTests, error: testsError } = await supabase
    .from("a_b_tests")
    .select("*")
    .eq("status", "active")
    .eq("component_id", pageData.id) // Assuming page ID is stored in component_id
    .maybeSingle();

  // If we have an active test, check variant assignment
  if (activeTests && !testsError) {
    // Generate session ID (in production, this would come from cookies or user session)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hash = hashString(sessionId);
    
    // Determine if user gets variant (e.g., 50% traffic split)
    const getsVariant = hash % 100 < (activeTests.traffic_percentage || 50);
    
    if (getsVariant) {
      try {
        // Parse variant JSON (assuming variant_b is the test variant)
        const variantJson = typeof activeTests.variant_b === 'string' 
          ? JSON.parse(activeTests.variant_b) 
          : activeTests.variant_b;
        
        // Merge variant JSON with base sections
        sections = deepMerge(sections, variantJson);
        
        // Record variant assignment (in production, you'd want to store this)
        console.log(`User assigned to variant B for test ${activeTests.test_id}`);
      } catch (variantError) {
        console.error("Error parsing variant JSON:", variantError);
        // Fall back to base sections if variant parsing fails
      }
    } else {
      console.log(`User assigned to control group (variant A) for test ${activeTests.test_id}`);
    }
  }

  // Create enriched page data
  const enrichedPage = {
    ...pageData,
    location: {
      suburb: pageData.location_name || "Local Area",
      state: pageData.location_state_region || "VIC",
      postcode: "3756" // Defaulting to the target area postcode
    }
  };

  // Create global site data for components
  const siteData: GlobalSiteData = {
    config: {
      site_name: pageData.company_name || "True Roof",
      tagline: pageData.tagline || "Professional Roofing Services",
      phone: pageData.phone_number || "+61 123 456 789",
      email: pageData.email || "contact@example.com",
      address: pageData.address || "123 Roofing St, Melbourne VIC 3000",
      logo_url: pageData.logo_url || "/logo.svg",
      primary_color: pageData.primary_color || "#f97316", // orange-500
      secondary_color: pageData.secondary_color || "#dc2626", // red-600
      website_url: pageData.website_url || "https://trueroof.com.au"
    },
    location: {
      suburb: pageData.location_name || "Local Area",
      region: pageData.location_state_region || "VIC",
      postcode: "3756",
      state: pageData.location_state_region || "VIC",
      service_radius_km: pageData.service_radius_km || 50,
      latitude: pageData.latitude,
      longitude: pageData.longitude
    },
    analytics: {
      sessionId: `session_${Date.now()}`,
      pageViewId: `page_${Date.now()}`
    }
  };

  // Return response with cache headers
  const responseData = { 
    page: enrichedPage, 
    sections, 
    siteData,
    error: null 
  };
  
  // In a Cloudflare Worker context, you would set headers like this:
  // return new Response(JSON.stringify(responseData), {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cache-Control': cacheControl,
  //     'CDN-Cache-Control': cacheControl,
  //   }
  // });
  
  // For React Router, we return the data directly but note that caching
  // would be handled at the Cloudflare Worker level
  console.log(`Cache control for ${slug}: ${cacheControl}`);
  
  return responseData;
}

export default function DynamicPage() {
  const { page, sections, siteData, error } = useLoaderData<typeof loader>();

  // Error safety net to prevent 500 crashes and provide debugging info
  if (error || !page || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-10 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-lg w-full">
          <h1 className="text-red-600 font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Route Debugger
          </h1>
          <p className="mt-4 text-slate-700 font-medium">{error || "Page data missing"}</p>
          <div className="mt-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-500 uppercase tracking-wider mb-2">Development Tip:</p>
            Verify that your Supabase row has the correct <strong>slug</strong> and that <strong>page_type</strong> is set correctly.
          </div>
          <a href="/" className="mt-6 inline-block text-blue-600 hover:underline text-sm font-semibold">
            &larr; Return Home
          </a>
        </div>
      </div>
    );
  }

  // Validate sections structure before rendering
  if (!validatePageSections(sections)) {
    // Fallback to traditional templates if sections are not in new format
    return (
      <div className="p-8 bg-yellow-50 text-yellow-700 rounded-lg mx-auto max-w-4xl my-8">
        <h2 className="text-xl font-bold mb-2">Legacy Page Format</h2>
        <p>This page is using the legacy page format. Please update the database to use the new JSON schema.</p>
        <pre className="mt-4 p-4 bg-yellow-100 rounded text-sm overflow-auto">
          {JSON.stringify(sections, null, 2)}
        </pre>
      </div>
    );
  }

  // Use DynamicPageRenderer for all pages
  return (
    <>
      <DynamicPageRenderer 
        sections={sections}
        siteData={siteData}
      />
      {/* Global components that should appear on all pages */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href={`tel:${siteData.config.phone}`}
          className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="text-2xl">📞</span>
          <span className="font-semibold">Call Now</span>
        </a>
      </div>
    </>
  );
}
