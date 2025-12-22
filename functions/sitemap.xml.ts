import { createClient } from "@supabase/supabase-js";

export const onRequest = async ({ env, request }) => {
  // 1. Initialize Supabase
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  // 2. Fetch all PUBLISHED pages (Slugs & Dates only to keep it fast)
  const { data: pages, error } = await supabase
    .from('pages')
    .select('slug, updated_at, page_type')
    .eq('status', 'published'); // Crucial: Don't show Google your drafts!

  if (error) {
    console.error("Sitemap Error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }

  // 3. Determine the Domain automatically (Works for Staging & Prod)
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // 4. Generate the XML String
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => {
    // Clean up slug: ensure it doesn't double-slash
    const cleanSlug = page.slug === '/' ? '' : page.slug.replace(/^\//, '');
    
    // Priority Logic: Homepage = 1.0, Hubs = 0.9, Local Pages = 0.8
    let priority = '0.8';
    if (page.page_type === 'home') priority = '1.0';
    if (page.page_type === 'service_hub') priority = '0.9';

    return `
  <url>
    <loc>${baseUrl}/${cleanSlug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

  // 5. Serve it as XML with caching
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      // Tell Google/Browsers to cache this result for 1 hour to save database hits
      "Cache-Control": "public, max-age=3600"
    }
  });
};
