import type { Page } from '@content';
import React from 'react';

import styles from './index.module.css';

function PostHeader({
  frontmatter: { title, excerpt, tags },
  metadata: { date },
}: {
  frontmatter: Page['frontmatter'];
  metadata: Page['metadata'];
}) {
  return (
    <div className={styles.postHeader}>
      <h1>{title}</h1>
      <p>{date as string}</p>
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

export default PostHeader;
