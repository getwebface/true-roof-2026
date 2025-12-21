import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

// Import the templates we just created
import HomeTemplate from "~/components/templates/HomeTemplate";
import ServiceHubTemplate from "~/components/templates/ServiceHubTemplate";
import LocalServiceTemplate from "~/components/templates/LocalServiceTemplate";

export async function loader({ params, context }: Route.LoaderArgs) {
  const env = (context as any).cloudflare?.env || process.env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  // Clean the slug: remove leading/trailing slashes, default to "/"
  let slug = params["*"] || "/";
  if (slug !== "/" && slug.endsWith("/")) slug = slug.slice(0, -1);

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new Response("Not Found", { status: 404 });
  }

  // Parse the JSON content once here in the loader
  const sections = typeof data.content_sections === 'string' 
    ? JSON.parse(data.content_sections) 
    : data.content_sections;

  return { page: data, sections };
}

export default function DynamicPage() {
  const { page, sections } = useLoaderData<typeof loader>();

  // This logic looks at the page_type column from your Supabase row
  switch (page.page_type) {
    case "home":
      return <HomeTemplate data={page} sections={sections} />;
    case "service_hub":
      return <ServiceHubTemplate data={page} sections={sections} />;
    case "local_service":
      return <LocalServiceTemplate data={page} sections={sections} />;
    default:
      // Fallback in case a page_type is missing or misspelled
      return (
        <div className="p-20 text-center font-sans">
          <h1 className="text-2xl font-bold">{page.h1_heading}</h1>
          <p className="mt-4 text-gray-600">This page is using the default fallback layout.</p>
        </div>
      );
  }
}
