import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

import HomeTemplate from "~/components/templates/HomeTemplate";
import ServiceHubTemplate from "~/components/templates/ServiceHubTemplate";
import LocalServiceTemplate from "~/components/templates/LocalServiceTemplate";

export async function loader({ params, context }: Route.LoaderArgs) {
  const env = (context as any).cloudflare?.env || process.env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  // LOGIC FIX: Handle the homepage slug specifically
  let slug = params["*"];
  if (!slug || slug === "" || slug === "/") {
    slug = "/";
  } else {
    // Standardize: Remove leading/trailing slashes for other pages
    slug = slug.replace(/^\/|\/$/g, "");
  }

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Supabase Error:", error);
    throw new Response("Not Found", { status: 404 });
  }

  const sections = typeof data.content_sections === 'string' 
    ? JSON.parse(data.content_sections) 
    : data.content_sections;

  return { page: data, sections, debugSlug: slug };
}

export default function DynamicPage() {
  const { page, sections, debugSlug } = useLoaderData<typeof loader>();

  if (!page) return <div>No data found for slug: {debugSlug}</div>;

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
          <p className="mt-4 text-gray-500">Page Type: {page.page_type}</p>
          <pre className="mt-10 bg-gray-100 p-4 text-left inline-block">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </div>
      );
  }
}
