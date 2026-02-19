export type StrapiResponse<T> = {
  data: T;
  meta?: unknown;
  error?: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
};

// Strapi v5 REST responses return fields at the top-level (no `attributes` wrapper).
// We model that as an entity that merges id + attributes.
export type StrapiEntity<TAttributes extends object> = { id: number; documentId?: string } & TAttributes;

export type StrapiMediaFormat = {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  mime?: string;
};

export type StrapiMediaAttributes = {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, StrapiMediaFormat> | null;
  url: string;
  mime: string;
};

export type StrapiMedia = StrapiEntity<StrapiMediaAttributes>;

export type SectionTheme = 'default' | 'tinted' | 'accent';

export type SharedRichTextBlock = {
  __component: 'shared.rich-text';
  id: number;
  body: string;
  theme?: SectionTheme | null;
};

export type SharedQuoteBlock = {
  __component: 'shared.quote';
  id: number;
  title?: string | null;
  body?: string | null;
  theme?: SectionTheme | null;
};

export type SharedMediaBlock = {
  __component: 'shared.media';
  id: number;
  file?: StrapiMedia | null;
};

export type SharedSliderBlock = {
  __component: 'shared.slider';
  id: number;
  // We don’t need to support this yet; keep it typed as unknown.
  [key: string]: unknown;
};

export type PageBlock =
  | SharedRichTextBlock
  | SharedQuoteBlock
  | SharedMediaBlock
  | SharedSliderBlock
  | { __component: string; id: number; [key: string]: unknown };

export type SharedSeo = {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia | { data: StrapiMedia | null } | null;
};

export type PageAttributes = {
  title: string;
  slug: string;
  seo?: SharedSeo | null;
  blocks?: PageBlock[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
};

