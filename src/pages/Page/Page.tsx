import { useEffect } from 'react';
import { PageRenderer } from '../../components/PageRenderer/PageRenderer';
import { usePage } from '../../hooks/usePage';
import styles from './Page.module.css';

export function Page(props: { slug: string; titleFallback: string }) {
  const page = usePage({ slug: props.slug, locale: 'sv' });

  useEffect(() => {
    if (page.status !== 'success') return;
    const title = page.data.seo?.metaTitle ?? page.data.title;
    if (title) document.title = title;
  }, [page]);

  return (
    <>
      <h1 className={styles.title}>{props.titleFallback}</h1>

      {page.status === 'loading' ? (
        <p className={styles.status} aria-live="polite">
          Hämtar innehåll…
        </p>
      ) : null}

      {page.status === 'error' ? (
        <p className={styles.error} role="alert">
          {page.error.message}
        </p>
      ) : null}

      {page.status === 'not_found' ? <p role="status">Hittade ingen sida med denna slug.</p> : null}

      {page.status === 'success' && page.data.blocks?.length ? <PageRenderer blocks={page.data.blocks} /> : null}

      {page.status === 'success' && !page.data.blocks?.length ? <p role="status">Sidan saknar blocks.</p> : null}
    </>
  );
}

