import type { Page } from '@content';
import Link from 'next/link';
import React from 'react';

import styles from './index.module.css';
import PostExcerpt from './PostExcerpt';

function RecentWriting({ posts }: { posts: Page[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>recent writing</h3>
        <Link href='/garden'>see more</Link>
      </div>
      <div className={styles.wrapper}>
        {posts.map((post) => (
          <PostExcerpt post={post} key={post.frontmatter.title} />
        ))}
      </div>
    </section>
  );
}

export default RecentWriting;
