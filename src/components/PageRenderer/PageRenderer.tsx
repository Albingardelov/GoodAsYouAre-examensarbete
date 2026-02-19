import ReactMarkdown from 'react-markdown';
import type { PageBlock, SectionTheme, SharedMediaBlock, SharedQuoteBlock, SharedRichTextBlock } from '../../types/strapi';
import { toAbsoluteStrapiUrl } from '../../api/strapi';
import styles from './PageRenderer.module.css';

const themeClass: Record<SectionTheme, string> = {
  default: styles.sectionDefault,
  tinted: styles.sectionTinted,
  accent: styles.sectionAccent,
};

function Section({ theme, children }: { theme?: SectionTheme | null; children: React.ReactNode }) {
  const cls = [styles.section, themeClass[theme ?? 'default']].join(' ');
  return (
    <div className={cls}>
      <div className={styles.sectionInner}>{children}</div>
    </div>
  );
}

export function PageRenderer(props: { blocks: PageBlock[] }) {
  return (
    <div className={styles.root}>
      {props.blocks.map((block) => {
        if (block.__component === 'shared.rich-text') {
          const b = block as SharedRichTextBlock;
          return (
            <Section key={block.id} theme={b.theme}>
              <div className={styles.richText}>
                <ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
                  {typeof b.body === 'string' ? b.body : ''}
                </ReactMarkdown>
              </div>
            </Section>
          );
        }

        if (block.__component === 'shared.quote') {
          const b = block as SharedQuoteBlock;
          const title = typeof b.title === 'string' ? b.title : null;
          const body = typeof b.body === 'string' ? b.body : null;
          return (
            <Section key={block.id} theme={b.theme}>
              <blockquote className={styles.quote} aria-label={title ?? 'Citat'}>
                {title ? <p className={styles.quoteTitle}>{title}</p> : null}
                {body ? <p className={styles.quoteBody}>{body}</p> : null}
              </blockquote>
            </Section>
          );
        }

        if (block.__component === 'shared.media') {
          const b = block as SharedMediaBlock;
          const media = b.file ?? null;
          if (!media) return null;

          const src = toAbsoluteStrapiUrl(typeof media.url === 'string' ? media.url : '');
          const alt =
            (typeof media.alternativeText === 'string' && media.alternativeText) ||
            (typeof media.caption === 'string' && media.caption) ||
            '';

          if (media.mime?.startsWith('image/')) {
            return (
              <Section key={block.id}>
                <figure className={styles.media}>
                  <img className={styles.mediaImg} src={src} alt={alt} loading="lazy" />
                  {media.caption ? <figcaption>{media.caption}</figcaption> : null}
                </figure>
              </Section>
            );
          }

          return (
            <Section key={block.id}>
              <p><a href={src}>Ladda ner fil</a></p>
            </Section>
          );
        }

        return null;
      })}
    </div>
  );
}
