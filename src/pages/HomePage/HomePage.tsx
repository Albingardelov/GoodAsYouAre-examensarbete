import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocale } from '../../hooks/useLocale';
import { usePage } from '../../hooks/usePage';
import { toAbsoluteStrapiUrl } from '../../api/strapi';
import { PageRenderer } from '../../components/PageRenderer/PageRenderer';
import type { SharedMediaBlock, SharedRichTextBlock } from '../../types/strapi';
import styles from './HomePage.module.css';

export function HomePage() {
  const { locale } = useLocale();
  const page = usePage({ slug: 'home', locale });

  useEffect(() => {
    if (page.status !== 'success') return;
    const title = page.data.seo?.metaTitle ?? page.data.title;
    if (title) document.title = title;
  }, [page]);

  if (page.status === 'loading') {
    return (
      <p className={styles.status} aria-live="polite">
        {locale === 'sv' ? 'Hämtar innehåll…' : 'Loading content…'}
      </p>
    );
  }

  if (page.status === 'error') {
    return (
      <p className={styles.error} role="alert">
        {page.error.message}
      </p>
    );
  }

  if (page.status !== 'success') return null;

  const blocks = page.data.blocks ?? [];

  // First media block → hero image
  const firstMediaIndex = blocks.findIndex((b) => b.__component === 'shared.media');
  const heroImageBlock = firstMediaIndex !== -1 ? (blocks[firstMediaIndex] as SharedMediaBlock) : null;
  const heroMedia = heroImageBlock?.file ?? null;

  // First rich-text block → hero text
  const firstRichTextIndex = blocks.findIndex((b) => b.__component === 'shared.rich-text');
  const heroTextBlock =
    firstRichTextIndex !== -1 ? (blocks[firstRichTextIndex] as SharedRichTextBlock) : null;

  const heroIndices = new Set([firstMediaIndex, firstRichTextIndex].filter((i) => i !== -1));
  const remainingBlocks = blocks.filter((_, i) => !heroIndices.has(i));

  const imageSrc =
    heroMedia && typeof heroMedia.url === 'string'
      ? toAbsoluteStrapiUrl(heroMedia.url)
      : null;
  const imageAlt =
    (typeof heroMedia?.alternativeText === 'string' && heroMedia.alternativeText) || '';

  return (
    <div className={styles.root}>
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            {heroTextBlock && (
              <div className={styles.heroBody}>
                <ReactMarkdown components={{ h1: ({ children }) => <h1>{children}</h1> }}>
                  {heroTextBlock.body}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {imageSrc && (
            <div className={styles.heroPhoto}>
              <img
                className={styles.heroImg}
                src={imageSrc}
                alt={imageAlt}
                loading="eager"
              />
            </div>
          )}
        </div>
      </section>

      {remainingBlocks.length > 0 && <PageRenderer blocks={remainingBlocks} />}
    </div>
  );
}
