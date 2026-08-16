import type { Page } from '@content';
import Link from 'next/link';
import React from 'react';

import styles from './index.module.css';

function PostExcerpt({
  post: {
    frontmatter: { excerpt, title, tags },
    metadata: { date },
    params: { slug },
  },
}: {
  post: Page;
}) {
  return (
    <div key={title} className={styles.postExcerptWrapper}>
      <span className={styles.date}>{date}</span>
      <Link href={`/garden/${slug}`} className={styles.title}>
        {title}
      </Link>
      <p className={styles.excerpt}>{excerpt}</p>
      <div className={styles.tagWrapper}>
        {tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PostExcerpt;
