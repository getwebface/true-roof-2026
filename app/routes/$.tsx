import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import HomeTemplate from "~/components/templates/HomeTemplate";
import ServiceHubTemplate from "~/components/templates/ServiceHubTemplate";
import LocalServiceTemplate from "~/components/templates/LocalServiceTemplate";

export async function loader({ params, context }: Route.LoaderArgs) {
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
    // Return a special error object instead of throwing
    return { page: null, error: "No data found for slug: " + slug };
  }

  const sections = typeof data.content_sections === 'string' 
    ? JSON.parse(data.content_sections) 
    : data.content_sections;

  return { page: data, sections, error: null };
}

export default function DynamicPage() {
  const { page, sections, error } = useLoaderData<typeof loader>();

  // If there's an error, show it clearly so we can debug
  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-10 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <h1 className="text-red-600 font-bold text-xl">Route Debugger</h1>
          <p className="mt-2 text-slate-600">{error || "Page data missing"}</p>
          <div className="mt-4 text-xs bg-slate-50 p-3 rounded font-mono">
            Check if your Supabase row has slug exactly: <strong>/</strong>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-black">{page.h1_heading}</h1>
          <pre className="mt-10 bg-gray-100 p-4 text-left inline-block">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </div>
      );
  }
}
