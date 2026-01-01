import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import HomeTemplate from "~/components/templates/HomeTemplate";
import ServiceHubTemplate from "~/components/templates/ServiceHubTemplate";
import LocalServiceTemplate from "~/components/templates/LocalServiceTemplate";

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
    return { page: null, sections: null, error: "No data found for slug: " + slug };
  }

  // Safely parse content_sections
  let sections = {};
  try {
    sections = typeof data.content_sections === 'string' 
      ? JSON.parse(data.content_sections) 
      : data.content_sections;
  } catch (parseError) {
    console.error("JSON Parse Error for sections:", parseError);
    return { page: null, sections: null, error: "Malformed content_sections JSON" };
  }

  /**
   * DATA ENRICHMENT FIX:
   * LocalServiceTemplate expects a 'location' object with suburb, state, and postcode.
   * We map the separate Supabase columns to the object structure required by the component.
   */
  const enrichedPage = {
    ...data,
    location: {
      suburb: data.location_name || "Local Area",
      state: data.location_state_region || "VIC",
      postcode: "3756" // Defaulting to the target area postcode
    }
  };

  return { page: enrichedPage, sections, error: null };
}

export default function DynamicPage() {
  const { page, sections, error } = useLoaderData<typeof loader>();

  // Error safety net to prevent 500 crashes and provide debugging info
  if (error || !page) {
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

  // Route to the correct template based on the page_type column
  switch (page.page_type) {
    case "home":
      return <HomeTemplate data={page} sections={sections} />;
    case "service_hub":
      return <ServiceHubTemplate data={page} sections={sections} />;
    case "local_service":
      return <LocalServiceTemplate data={page} sections={sections} />;
    default:
      return (
        <div className="p-20 text-center font-sans">
          <h1 className="text-4xl font-black">{page.h1_heading || "Untitled Page"}</h1>
          <p className="text-slate-500 mt-4">Unknown page type: {page.page_type}</p>
          <pre className="mt-10 bg-gray-100 p-4 text-left inline-block rounded-lg shadow-inner">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </div>
      );
  }
}
