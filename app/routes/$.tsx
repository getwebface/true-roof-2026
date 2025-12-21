import { data } from "react-router";
import type { Route } from "./+types/$";
import { createClient } from "@supabase/supabase-js";

// 1. THE BACKEND LOGIC
export async function loader({ request, context }: Route.LoaderArgs) {
  // In React Router v7 on Cloudflare, env vars are in context.cloudflare.env
  const env = context.cloudflare.env as any;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = env;
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/|\/$/g, ''); 
  const searchSlug = slug === "" ? "/" : slug;

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', searchSlug)
    .eq('status', 'published')
    .single();

  if (!page || error) {
    throw data("Page Not Found", { status: 404 });
  }

  // Return data with Cache Headers (ISR)
  return data({ page }, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=604800",
    },
  });
}

// 2. THE FRONTEND UI
export default function DynamicPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  const content = page.content_sections || {}; 

  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: "1.6", color: "#333" }}>
      <header style={{ padding: "2rem", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{page.h1_heading}</h1>
          {page.location_name && (
            <span style={{ 
              background: "#dcfce7", color: "#166534", 
              padding: "0.25rem 0.75rem", borderRadius: "999px", 
              fontWeight: "bold", fontSize: "0.875rem" 
            }}>
              📍 Serving {page.location_name}
            </span>
          )}
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#666", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>
              {key.replace(/_/g, " ")}
            </h3>
            <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {JSON.stringify(value, null, 2).replace(/"/g, '')}
              </pre>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
