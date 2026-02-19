import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocale } from '../../hooks/useLocale';
import { usePage } from '../../hooks/usePage';
import { toAbsoluteStrapiUrl } from '../../api/strapi';
import { PageRenderer } from '../../components/PageRenderer/PageRenderer';
import type { SharedMediaBlock, SharedRichTextBlock } from '../../types/strapi';
import styles from './AboutPage.module.css';

export function AboutPage() {
  const { locale } = useLocale();
  const page = usePage({ slug: 'about', locale });

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

  // First media block → profile photo
  const firstMediaIndex = blocks.findIndex((b) => b.__component === 'shared.media');
  const profileBlock = firstMediaIndex !== -1 ? (blocks[firstMediaIndex] as SharedMediaBlock) : null;
  const profileMedia = profileBlock?.file ?? null;

  // First rich-text block → hero text (shown beside the photo)
  const firstRichTextIndex = blocks.findIndex((b) => b.__component === 'shared.rich-text');
  const heroTextBlock =
    firstRichTextIndex !== -1 ? (blocks[firstRichTextIndex] as SharedRichTextBlock) : null;

  // Everything else renders normally below the hero
  const heroIndices = new Set([firstMediaIndex, firstRichTextIndex].filter((i) => i !== -1));
  const remainingBlocks = blocks.filter((_, i) => !heroIndices.has(i));

  const profileSrc =
    profileMedia && typeof profileMedia.url === 'string'
      ? toAbsoluteStrapiUrl(profileMedia.url)
      : null;
  const profileAlt =
    (typeof profileMedia?.alternativeText === 'string' && profileMedia.alternativeText) ||
    (locale === 'sv' ? 'Profilbild' : 'Profile photo');

  return (
    <div className={styles.root}>
      {/* ── Hero: text left, photo right ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.name}>{locale === 'sv' ? 'Om mig' : 'About me'}</h1>
            {heroTextBlock && (
              <div className={styles.heroBody}>
                <ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
                  {heroTextBlock.body}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className={styles.heroPhoto}>
            {profileSrc ? (
              <img
                className={styles.avatar}
                src={profileSrc}
                alt={profileAlt}
                width={260}
                height={260}
                loading="eager"
              />
            ) : (
              <div className={styles.avatarPlaceholder} aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      {/* ── Remaining blocks ── */}
      {remainingBlocks.length > 0 && <PageRenderer blocks={remainingBlocks} />}
    </div>
  );
}
