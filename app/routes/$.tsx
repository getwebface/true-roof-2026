import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import DynamicPageRenderer from "~/components/DynamicPageRenderer";
import { validatePageSections } from "~/components/registry";
import type { GlobalSiteData } from "~/types/sdui";

export async function loader({ params, context }: Route.LoaderArgs) {
  // Get environment variables from Cloudflare context or process
  const env = (context as any).cloudflare?.env || process.env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  // Normalize slug: if empty or undefined, use "/"
  let slug = params["*"] || "/";
  if (slug !== "/" && slug.endsWith("/")) slug = slug.slice(0, -1);
  if (slug === "") slug = "/";

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Supabase Error for slug [" + slug + "]:", error);
    return { page: null, sections: null, siteData: null, error: "No data found for slug: " + slug };
  }

  // Safely parse content_sections
  let sections = {};
  try {
    sections = typeof data.content_sections === 'string' 
      ? JSON.parse(data.content_sections) 
      : data.content_sections;
  } catch (parseError) {
    console.error("JSON Parse Error for sections:", parseError);
    return { page: null, sections: null, siteData: null, error: "Malformed content_sections JSON" };
  }

  // Create enriched page data
  const enrichedPage = {
    ...data,
    location: {
      suburb: data.location_name || "Local Area",
      state: data.location_state_region || "VIC",
      postcode: "3756" // Defaulting to the target area postcode
    }
  };

  // Create global site data for components
  const siteData: GlobalSiteData = {
    config: {
      site_name: data.company_name || "True Roof",
      tagline: data.tagline || "Professional Roofing Services",
      phone: data.phone_number || "+61 123 456 789",
      email: data.email || "contact@example.com",
      address: data.address || "123 Roofing St, Melbourne VIC 3000",
      logo_url: data.logo_url || "/logo.svg",
      primary_color: data.primary_color || "#f97316", // orange-500
      secondary_color: data.secondary_color || "#dc2626", // red-600
      website_url: data.website_url || "https://trueroof.com.au"
    },
    location: {
      suburb: data.location_name || "Local Area",
      region: data.location_state_region || "VIC",
      postcode: "3756",
      state: data.location_state_region || "VIC",
      service_radius_km: data.service_radius_km || 50,
      latitude: data.latitude,
      longitude: data.longitude
    },
    analytics: {
      sessionId: `session_${Date.now()}`,
      pageViewId: `page_${Date.now()}`
    }
  };

  return { 
    page: enrichedPage, 
    sections, 
    siteData,
    error: null 
  };
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
