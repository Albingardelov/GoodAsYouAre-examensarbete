import type { PageBlock, SharedMediaBlock, SharedQuoteBlock, SharedRichTextBlock } from '../../types/strapi';
import { toAbsoluteStrapiUrl } from '../../api/strapi';
import { richTextToElements } from './richTextToElements';
import styles from './PageRenderer.module.css';

export function PageRenderer(props: { blocks: PageBlock[] }) {
  return (
    <div className={styles.root}>
      {props.blocks.map((block) => {
        if (block.__component === 'shared.rich-text') {
          const b = block as SharedRichTextBlock;
          return (
            <section key={block.id} className={styles.richText}>
              {richTextToElements(typeof b.body === 'string' ? b.body : '')}
            </section>
          );
        }

        if (block.__component === 'shared.quote') {
          const b = block as SharedQuoteBlock;
          const title = typeof b.title === 'string' ? b.title : null;
          const body = typeof b.body === 'string' ? b.body : null;
          return (
            <section key={block.id} className={styles.quote} aria-label={title ?? 'Citat'}>
              {title ? <p className={styles.quoteTitle}>{title}</p> : null}
              {body ? <p className={styles.quoteBody}>{body}</p> : null}
            </section>
          );
        }

        if (block.__component === 'shared.media') {
          const b = block as SharedMediaBlock;
          const media = b.file?.data ?? null;
          if (!media) return null;

          const src = toAbsoluteStrapiUrl(typeof media.url === 'string' ? media.url : '');
          const alt =
            (typeof media.alternativeText === 'string' && media.alternativeText) ||
            (typeof media.caption === 'string' && media.caption) ||
            '';

          if (media.mime?.startsWith('image/')) {
            return (
              <figure key={block.id} className={styles.media}>
                <img className={styles.mediaImg} src={src} alt={alt} loading="lazy" />
                {media.caption ? <figcaption>{media.caption}</figcaption> : null}
              </figure>
            );
          }

          return (
            <p key={block.id}>
              <a href={src}>Ladda ner fil</a>
            </p>
          );
        }

        // Unhandled block type for now
        return null;
      })}
    </div>
  );
}

