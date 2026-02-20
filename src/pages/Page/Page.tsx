import { useEffect } from 'react';
import { PageRenderer } from '../../components/PageRenderer/PageRenderer';
import { usePage } from '../../hooks/usePage';
import { useLocale } from '../../hooks/useLocale';
import styles from './Page.module.css';

export function Page(props: { slug: string; titleFallback: string }) {
  const { locale } = useLocale();
  const page = usePage({ slug: props.slug, locale });
  const splitLayout = props.slug === 'act' || props.slug === 'toxism-vs-narcissism';

  useEffect(() => {
    if (page.status !== 'success') return;
    const title = page.data.seo?.metaTitle ?? page.data.title;
    if (title) document.title = title;
  }, [page]);

  return (
    <>
      {!splitLayout && (
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>{props.titleFallback}</h1>
        </div>
      )}

      {page.status === 'loading' ? (
        <p className={styles.status} aria-live="polite">
          {locale === 'sv' ? 'Hämtar innehåll…' : 'Loading content…'}
        </p>
      ) : null}

      {page.status === 'error' ? (
        <p className={styles.error} role="alert">
          {page.error.message}
        </p>
      ) : null}

      {page.status === 'not_found' ? (
        <p role="status">{locale === 'sv' ? 'Hittade ingen sida med denna slug.' : 'No page found for this slug.'}</p>
      ) : null}

      {page.status === 'success' && page.data.blocks?.length ? (
        <PageRenderer
          blocks={page.data.blocks}
          splitLayout={splitLayout}
        />
      ) : null}

      {page.status === 'success' && !page.data.blocks?.length ? (
        <p role="status">{locale === 'sv' ? 'Sidan saknar blocks.' : 'Page has no blocks.'}</p>
      ) : null}
    </>
  );
}

