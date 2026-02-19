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

function AccordionRichText({ body, media }: { body: string; media?: SharedMediaBlock | null }) {
  const headingMatch = body.match(/^#{1,3}\s+(.+)$/m);
  const title = headingMatch ? headingMatch[1] : null;
  const bodyWithoutHeading = headingMatch ? body.replace(headingMatch[0], '').trim() : body;

  const mediaFile = media?.file ?? null;
  const imageSrc =
    mediaFile && typeof mediaFile.url === 'string'
      ? toAbsoluteStrapiUrl(mediaFile.url)
      : null;
  const imageAlt =
    (typeof mediaFile?.alternativeText === 'string' && mediaFile.alternativeText) ||
    (typeof mediaFile?.caption === 'string' && mediaFile.caption) ||
    '';

  if (!title) {
    return (
      <div className={styles.richText}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    );
  }

  return (
    <details className={styles.accordion}>
      <summary className={styles.accordionSummary}>{title}</summary>
      <div className={styles.accordionBody}>
        {imageSrc && mediaFile?.mime?.startsWith('image/') && (
          <figure className={styles.accordionImage}>
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              width={mediaFile.width ?? undefined}
              height={mediaFile.height ?? undefined}
            />
          </figure>
        )}
        <div className={styles.richText}>
          <ReactMarkdown>{bodyWithoutHeading}</ReactMarkdown>
        </div>
      </div>
    </details>
  );
}

type AccordionGroup = {
  richText: SharedRichTextBlock;
  media?: SharedMediaBlock;
};

function groupAccordionBlocks(blocks: PageBlock[]): AccordionGroup[] {
  const groups: AccordionGroup[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block.__component === 'shared.rich-text') {
      const next = blocks[i + 1];
      if (next && next.__component === 'shared.media') {
        groups.push({ richText: block as SharedRichTextBlock, media: next as SharedMediaBlock });
        i += 2;
      } else {
        groups.push({ richText: block as SharedRichTextBlock });
        i += 1;
      }
    } else {
      i += 1;
    }
  }
  return groups;
}

export function PageRenderer(props: { blocks: PageBlock[]; accordion?: boolean }) {
  if (props.accordion) {
    const groups = groupAccordionBlocks(props.blocks);
    return (
      <div className={styles.root}>
        {groups.map(({ richText, media }) => (
          <div key={richText.id} className={styles.accordionWrapper}>
            <AccordionRichText
              body={typeof richText.body === 'string' ? richText.body : ''}
              media={media}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {props.blocks.map((block) => {
        if (block.__component === 'shared.rich-text') {
          const b = block as SharedRichTextBlock;
          const body = typeof b.body === 'string' ? b.body : '';
          return (
            <Section key={block.id} theme={b.theme}>
              <div className={styles.richText}>
                <ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
                  {body}
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
                  <img
                    className={styles.mediaImg}
                    src={src}
                    alt={alt}
                    loading="lazy"
                    width={media.width ?? undefined}
                    height={media.height ?? undefined}
                  />
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
