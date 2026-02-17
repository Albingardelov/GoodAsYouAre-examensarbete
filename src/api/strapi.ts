import type { PageAttributes, StrapiEntity, StrapiResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

function assertStrapiUrl(): string {
  if (!STRAPI_URL) {
    throw new Error('Missing VITE_STRAPI_URL. Set it in Web/.env and restart the dev server.');
  }
  return STRAPI_URL.replace(/\/$/, '');
}

export function toAbsoluteStrapiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${assertStrapiUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function fetchPageBySlug(params: {
  slug: string;
  locale?: string;
}): Promise<StrapiEntity<PageAttributes> | null> {
  const baseUrl = assertStrapiUrl();
  const qs = new URLSearchParams();
  // Strapi v5 does not support populate=deep. Use populate=* (1-level) for now.
  // If we later need deeper population, we’ll explicitly enumerate paths.
  qs.set('populate', '*');
  qs.set('filters[slug][$eq]', params.slug);
  if (params.locale) qs.set('locale', params.locale);

  const res = await fetch(`${baseUrl}/api/pages?${qs.toString()}`);
  const json = (await res.json()) as StrapiResponse<StrapiEntity<PageAttributes>[]>;

  if (!res.ok) {
    const msg = json?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return json.data?.[0] ?? null;
}

