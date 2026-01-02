import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import DynamicPageRenderer from "~/components/DynamicPageRenderer";
import { validatePageSections } from "~/components/registry";
import type { GlobalSiteData } from "~/types/sdui";
import { initLogger, error as logError, info as logInfo, warn as logWarn } from "~/lib/logging/logger";

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

// Safe parse function for page data with comprehensive defaults
function safeParsePageData(rawPageData: any): {
  id: string;
  slug: string;
  page_type: string;
  company_name: string;
  tagline: string;
  phone_number: string;
  email: string;
  address: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  website_url: string;
  location_name: string;
  location_state_region: string;
  postcode: string;
  service_radius_km: number;
  latitude?: number;
  longitude?: number;
  content_sections: any;
} {
  // Ensure we have an object to work with
  const pageData = isObject(rawPageData) ? rawPageData : {};

  return {
    id: typeof pageData.id === 'string' ? pageData.id : 'default-page-id',
    slug: typeof pageData.slug === 'string' ? pageData.slug : '/',
    page_type: typeof pageData.page_type === 'string' ? pageData.page_type : 'home',
    company_name: typeof pageData.company_name === 'string' ? pageData.company_name : 'True Roof',
    tagline: typeof pageData.tagline === 'string' ? pageData.tagline : 'Professional Roofing Services',
    phone_number: typeof pageData.phone_number === 'string' ? pageData.phone_number : '+61 400 000 000',
    email: typeof pageData.email === 'string' ? pageData.email : 'contact@example.com',
    address: typeof pageData.address === 'string' ? pageData.address : '123 Roofing St, Melbourne VIC 3000',
    logo_url: typeof pageData.logo_url === 'string' ? pageData.logo_url : '/logo.svg',
    primary_color: typeof pageData.primary_color === 'string' ? pageData.primary_color : '#f97316',
    secondary_color: typeof pageData.secondary_color === 'string' ? pageData.secondary_color : '#dc2626',
    website_url: typeof pageData.website_url === 'string' ? pageData.website_url : 'https://trueroof.com.au',
    location_name: typeof pageData.location_name === 'string' ? pageData.location_name : 'Local Area',
    location_state_region: typeof pageData.location_state_region === 'string' ? pageData.location_state_region : 'VIC',
    postcode: typeof pageData.postcode === 'string' ? pageData.postcode : '3756',
    service_radius_km: typeof pageData.service_radius_km === 'number' ? pageData.service_radius_km : 50,
    latitude: typeof pageData.latitude === 'number' ? pageData.latitude : undefined,
    longitude: typeof pageData.longitude === 'number' ? pageData.longitude : undefined,
    content_sections: pageData.content_sections // Keep raw for separate parsing
  };
}

export async function loader({ params, context, request }: Route.LoaderArgs) {
  // Initialize logger
  const logger = initLogger();

  // Get environment variables from Cloudflare context or process
  const env = (context as any).cloudflare?.env || process.env;

  // Validate required environment variables
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    const errorMsg = "Missing required Supabase environment variables";
    logError('server', errorMsg, new Error(errorMsg), {
      hasSupabaseUrl: !!env.SUPABASE_URL,
      hasSupabaseKey: !!env.SUPABASE_ANON_KEY
    });
    return {
      page: null,
      sections: null,
      siteData: null,
      error: "Server configuration error"
    };
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  // Normalize slug: if empty or undefined, use "/"
  let slug = params["*"] || "/";
  if (slug !== "/" && slug.endsWith("/")) slug = slug.slice(0, -1);
  if (slug === "") slug = "/";

  logInfo('server', `Loading page for slug: ${slug}`, {
    originalSlug: params["*"],
    normalizedSlug: slug
  });

  // Check cache headers from request
  const cacheKey = `page:${slug}`;
  const cacheControl = request.headers.get('Cache-Control') || 'public, max-age=60, stale-while-revalidate=300';

  try {
    // Fetch page data with error handling
    const { data: pageData, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (pageError) {
      logError('database', `Supabase query failed for slug: ${slug}`, pageError, {
        slug,
        errorCode: pageError.code,
        errorMessage: pageError.message
      });
      return {
        page: null,
        sections: null,
        siteData: null,
        error: `Page not found: ${slug}`
      };
    }

    if (!pageData) {
      logWarn('database', `No page data found for slug: ${slug}`);
      return {
        page: null,
        sections: null,
        siteData: null,
        error: `Page not found: ${slug}`
      };
    }

    // Apply safe parsing to ensure all data has proper types and defaults
    const safePageData = safeParsePageData(pageData);

    // Parse base sections with robust error handling
    let sections: any = {};
    try {
      if (safePageData.content_sections) {
        sections = typeof safePageData.content_sections === 'string'
          ? JSON.parse(safePageData.content_sections)
          : safePageData.content_sections;
      } else {
        logWarn('validation', `No content_sections found for page: ${slug}`, {
          pageId: safePageData.id,
          pageType: safePageData.page_type
        });
        // Provide default structure for DynamicPageRenderer
        sections = {
          layout_order: [],
          sections: {}
        };
      }
    } catch (parseError) {
      logError('validation', `JSON parse error for content_sections on page: ${slug}`, parseError as Error, {
        pageId: safePageData.id,
        contentSectionsType: typeof safePageData.content_sections,
        contentSectionsLength: typeof safePageData.content_sections === 'string' ? safePageData.content_sections.length : 'N/A'
      });
      // Provide fallback structure
      sections = {
        layout_order: [],
        sections: {}
      };
    }

    // Ensure the structure matches what DynamicPageRenderer expects
    if (!sections.layout_order || !sections.sections) {
      logWarn('validation', `Invalid sections structure for DynamicPageRenderer on page: ${slug}`, {
        pageId: safePageData.id,
        hasLayoutOrder: !!sections.layout_order,
        hasSections: !!sections.sections
      });
      // Fix the structure
      sections = {
        layout_order: sections.layout_order || [],
        sections: sections.sections || sections
      };
    }

    // Check for active A/B tests for this page (fixed field names)
    let finalSections = sections;
    try {
      const { data: activeTests, error: testsError } = await supabase
        .from("a_b_tests")
        .select("*")
        .eq("status", "active")
        .eq("page_id", safePageData.id) // Fixed: use page_id instead of component_id
        .maybeSingle();

      if (testsError) {
        logWarn('database', `A/B test query failed for page: ${slug}`, {
          pageId: safePageData.id,
          error: testsError.message
        });
      } else if (activeTests) {
        // Generate session ID (in production, this would come from cookies or user session)
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const hash = hashString(sessionId);

        // Determine if user gets variant (fixed: use test_group_size instead of traffic_percentage)
        const trafficSplit = activeTests.test_group_size || 0.5; // Default 50%
        const getsVariant = hash % 100 < (trafficSplit * 100);

        if (getsVariant) {
          try {
            // Parse variant JSON (fixed: use variant_b as the test variant)
            const variantJson = typeof activeTests.variant_b === 'string'
              ? JSON.parse(activeTests.variant_b)
              : activeTests.variant_b;

            if (variantJson) {
              // Merge variant JSON with base sections
              finalSections = deepMerge(sections, variantJson);

              logInfo('server', `Applied A/B test variant B for page: ${slug}`, {
                testId: activeTests.test_id,
                pageId: safePageData.id,
                sessionId
              });
            }
          } catch (variantError) {
            logError('validation', `Error parsing A/B test variant JSON for page: ${slug}`, variantError as Error, {
              testId: activeTests.test_id,
              pageId: safePageData.id
            });
            // Fall back to base sections if variant parsing fails
            finalSections = sections;
          }
        } else {
          logInfo('server', `User assigned to A/B test control group for page: ${slug}`, {
            testId: activeTests.test_id,
            pageId: safePageData.id,
            sessionId
          });
        }
      }
    } catch (abTestError) {
      logError('server', `A/B testing error for page: ${slug}`, abTestError as Error, {
        pageId: safePageData.id
      });
      // Continue with base sections
      finalSections = sections;
    }

    // Create enriched page data with null safety using safe parsed data
    const enrichedPage = {
      ...safePageData,
      location: {
        suburb: safePageData.location_name,
        state: safePageData.location_state_region,
        postcode: safePageData.postcode
      }
    };

    // Create global site data for components with comprehensive null safety
    // Using safe parsed data ensures EVERY field has proper defaults
    const siteData: GlobalSiteData = {
      config: {
        site_name: safePageData.company_name,
        tagline: safePageData.tagline,
        phone: safePageData.phone_number,
        email: safePageData.email,
        address: safePageData.address,
        logo_url: safePageData.logo_url,
        primary_color: safePageData.primary_color,
        secondary_color: safePageData.secondary_color,
        website_url: safePageData.website_url
      },
      location: {
        suburb: safePageData.location_name,
        region: safePageData.location_state_region,
        postcode: safePageData.postcode,
        state: safePageData.location_state_region,
        service_radius_km: safePageData.service_radius_km,
        latitude: safePageData.latitude,
        longitude: safePageData.longitude
      },
      analytics: {
        sessionId: `session_${Date.now()}`,
        pageViewId: `page_${Date.now()}`
      }
    };

    logInfo('server', `Successfully loaded page: ${slug}`, {
      pageId: safePageData.id,
      pageType: safePageData.page_type,
      hasSections: Object.keys(finalSections).length > 0,
      cacheControl
    });

    // Return response with cache headers
    const responseData = {
      page: enrichedPage,
      sections: finalSections,
      siteData,
      error: null
    };

    return responseData;

  } catch (unexpectedError) {
    logError('server', `Unexpected error loading page: ${slug}`, unexpectedError as Error, {
      slug,
      userAgent: request.headers.get('User-Agent'),
      url: request.url
    });

    return {
      page: null,
      sections: null,
      siteData: null,
      error: "Internal server error"
    };
  }
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
