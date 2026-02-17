import { useEffect, useMemo, useState } from 'react';
import { fetchPageBySlug } from '../api/strapi';
import type { PageAttributes, StrapiEntity } from '../types/strapi';

type State =
  | { status: 'idle' | 'loading'; data: null; error: null }
  | { status: 'success'; data: StrapiEntity<PageAttributes>; error: null }
  | { status: 'not_found'; data: null; error: null }
  | { status: 'error'; data: null; error: Error };

export function usePage(params: { slug: string; locale?: string }) {
  const key = useMemo(() => `${params.slug}::${params.locale ?? ''}`, [params.slug, params.locale]);
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });

    fetchPageBySlug(params)
      .then((page) => {
        if (cancelled) return;
        if (!page) {
          setState({ status: 'not_found', data: null, error: null });
          return;
        }
        setState({ status: 'success', data: page, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: 'error', data: null, error: err instanceof Error ? err : new Error(String(err)) });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

