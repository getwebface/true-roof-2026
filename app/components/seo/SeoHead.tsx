// SEO Head Component
// Handles all meta tags, Open Graph, Twitter Cards, and structured data
// Uses client-side document manipulation for dynamic SEO

'use client';

import { useEffect } from 'react';
import type { GlobalSiteData } from '~/types/sdui';

interface SeoHeadProps {
  siteData: GlobalSiteData;
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  pageUrl?: string;
  pageType?: 'website' | 'article' | 'product' | 'profile';
  keywords?: string[];
  canonicalUrl?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  siteData,
  pageTitle,
  pageDescription,
  pageImage,
  pageUrl,
  pageType = 'website',
  keywords = [],
  canonicalUrl
}) => {
  useEffect(() => {
    // Build final values with fallbacks
    const title = pageTitle || `${siteData.config.site_name} - ${siteData.config.tagline}`;
    const description = pageDescription || siteData.config.tagline;
    const image = pageImage || '/og-image.jpg'; // Default OG image
    const url = pageUrl || siteData.config.website_url || 'https://trueroof.com.au';
    const canonical = canonicalUrl || url;

    // Generate keywords string
    const keywordsString = [
      'roofing',
      'roof repair',
      'roofing services',
      siteData.location?.suburb?.toLowerCase(),
      siteData.location?.state?.toLowerCase(),
      ...keywords
    ].filter(Boolean).join(', ');

    // Update document title
    document.title = title;

    // Helper function to set or update meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Helper function to set or update link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

      if (element) {
        element.href = href;
      } else {
        element = document.createElement('link');
        element.rel = rel;
        element.href = href;
        document.head.appendChild(element);
      }
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywordsString);
    setMetaTag('author', siteData.config.site_name);
    setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Canonical URL
    setLinkTag('canonical', canonical);

    // Open Graph Tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image.startsWith('http') ? image : `${url}${image}`, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', pageType, true);
    setMetaTag('og:site_name', siteData.config.site_name, true);
    setMetaTag('og:locale', 'en_AU', true);

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image.startsWith('http') ? image : `${url}${image}`);

    // Additional Meta Tags
    setMetaTag('theme-color', siteData.config.primary_color || '#f97316');
    setMetaTag('msapplication-TileColor', siteData.config.primary_color || '#f97316');
    setMetaTag('format-detection', 'telephone=yes');
    setMetaTag('contact', siteData.config.phone);

    // Dublin Core tags
    setMetaTag('DC.title', title);
    setMetaTag('DC.creator', siteData.config.site_name);
    setMetaTag('DC.subject', keywordsString);
    setMetaTag('DC.description', description);

    // Geo Tags
    if (siteData.location?.latitude && siteData.location?.longitude) {
      setMetaTag('geo.region', `AU-${siteData.location.state}`);
      setMetaTag('geo.placename', siteData.location.suburb);
      setMetaTag('geo.position', `${siteData.location.latitude};${siteData.location.longitude}`);
      setMetaTag('ICBM', `${siteData.location.latitude}, ${siteData.location.longitude}`);
    }

    // Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": siteData.config.site_name,
      "description": siteData.config.tagline,
      "url": siteData.config.website_url,
      "telephone": siteData.config.phone,
      "email": siteData.config.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": siteData.config.address,
        "addressLocality": siteData.location?.suburb,
        "addressRegion": siteData.location?.state,
        "postalCode": siteData.location?.postcode,
        "addressCountry": "AU"
      },
      "geo": siteData.location?.latitude && siteData.location?.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": siteData.location.latitude,
        "longitude": siteData.location.longitude
      } : undefined,
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": siteData.location?.latitude || -37.8136, // Melbourne fallback
          "longitude": siteData.location?.longitude || 144.9631
        },
        "geoRadius": (siteData.location?.service_radius_km || 50) * 1000 // Convert to meters
      },
      "priceRange": "$$",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "currenciesAccepted": "AUD"
    };

    // Update or create JSON-LD script
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (jsonLdScript) {
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(jsonLdScript);
    }

  }, [siteData, pageTitle, pageDescription, pageImage, pageUrl, pageType, keywords, canonicalUrl]);

  // This component doesn't render anything visible
  return null;
};

export default SeoHead;
