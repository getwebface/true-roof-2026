import { useLoaderData } from "react-router";
import { createClient } from "@supabase/supabase-js";
import type { Route } from "./+types/$";

// Import Templates
import HomeTemplate from "~/components/templates/HomeTemplate";
import ServiceHubTemplate from "~/components/templates/ServiceHubTemplate";
import LocalServiceTemplate from "~/components/templates/LocalServiceTemplate";

export async function loader({ params, context }: Route.LoaderArgs) {
  const env = (context as any).cloudflare?.env || process.env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  const slug = params["*"] || "/"; // Handle root slug

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) throw new Response("Not Found", { status: 404 });

  // Parse the JSON once in the loader
  const sections = typeof data.content_sections === 'string' 
    ? JSON.parse(data.content_sections) 
    : data.content_sections;

  return { page: data, sections };
}

export default function DynamicPage() {
  const { page, sections } = useLoaderData<typeof loader>();

  switch (page.page_type) {
    case "home":
      return <HomeTemplate data={page} sections={sections} />;
    case "service_hub":
      return <ServiceHubTemplate data={page} sections={sections} />;
    case "local_service":
      return <LocalServiceTemplate data={page} sections={sections} />;
    default:
      return (
        <div className="p-20 text-center">
          <h1>{page.h1_heading}</h1>
          <p>Generic layout fallback.</p>
        </div>
      );
  }
}
