import React from 'react';

import styles from './index.module.css';

type Repo = {
  description: string;
  homepage?: string;
  id: string;
  name: string;
  topics: string[];
  svn_url: string;
};

function RecentProjects({ repositories }: { repositories: Repo[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>open source and previous work</h3>
      </div>
      <div className={styles.wrapper}>
        {repositories.map(
          ({ description, homepage, id, name, topics, svn_url: svnUrl }) => (
            <div key={id} className={styles.repoWrapper}>
              {topics && (
                <span className={styles.topics}>
                  {topics.slice(0, 2).join(' / ')}
                </span>
              )}
              <h4 className={styles.repoName}>{name}</h4>
              <p className={styles.repoDescription}>{description}</p>
              <ul className={styles.repoLinks}>
                {' '}
                <a href={svnUrl}>github</a>
                {homepage && (
                  <>
                    {' / '}
                    <a href={homepage}>site</a>
                  </>
                )}
              </ul>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default RecentProjects;
