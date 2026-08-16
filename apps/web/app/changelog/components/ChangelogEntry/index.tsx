import type { ChangelogEntryType } from '@content';
import { evaluate } from '@mdx-js/mdx';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';

async function ChangelogEntry({
  entry,
  open = true,
}: {
  entry: ChangelogEntryType;
  open: boolean;
}) {
  const { default: Content } = await evaluate(entry.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    Fragment: (props: object) =>
      React.createElement('section', {
        className: 'mdx detail',
        ...props,
      }),
  });

  return (
    <details open={open} className={styles.changelogEntry}>
      <summary className={styles.changelogSummary}>
        <h2>{entry.frontmatter.title}</h2>
        <div className='dot' />
      </summary>
      <Content />
    </details>
  );
}

export default ChangelogEntry;
