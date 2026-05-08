import { useEffect } from 'react';

interface SeoMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const ensureMetaTag = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

const ensureCanonical = () => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  return link;
};

const SeoMeta = ({ title, description, canonicalPath, noindex, jsonLd }: SeoMetaProps) => {
  useEffect(() => {
    document.title = title;

    const baseUrl =
      (typeof window !== 'undefined' && window.location.origin) || 'https://atlasbrief.vercel.app';
    const canonical = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

    ensureMetaTag('meta[name="description"]', { name: 'description' }).setAttribute(
      'content',
      description
    );
    ensureMetaTag('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title);
    ensureMetaTag('meta[property="og:description"]', { property: 'og:description' }).setAttribute(
      'content',
      description
    );
    ensureMetaTag('meta[property="og:type"]', { property: 'og:type' }).setAttribute('content', 'website');
    ensureMetaTag('meta[property="og:url"]', { property: 'og:url' }).setAttribute('content', canonical);
    ensureMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }).setAttribute('content', title);
    ensureMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }).setAttribute(
      'content',
      description
    );

    const robots = ensureMetaTag('meta[name="robots"]', { name: 'robots' });
    robots.setAttribute('content', noindex ? 'noindex,nofollow' : 'index,follow');

    ensureCanonical().setAttribute('href', canonical);

    const ldScriptId = 'atlasbrief-jsonld';
    const existing = document.getElementById(ldScriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      const script = existing ?? document.createElement('script');
      script.id = ldScriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      if (!existing) {
        document.head.appendChild(script);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [canonicalPath, description, jsonLd, noindex, title]);

  return null;
};

export default SeoMeta;
