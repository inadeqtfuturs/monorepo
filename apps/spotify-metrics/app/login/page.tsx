'use client';

import React from 'react';
import { authenticate } from '@/lib/spotify';
import styles from './index.module.css';

function LoginPage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.content}>
        <h1>spotify metrics</h1>
        <p>
          a simple way to get insights into your spotify favorites and listening
          habits
        </p>
        <button
          type='button'
          onClick={async () => await authenticate()}
          className={styles.loginButton}
        >
          login
        </button>
        <small>
          use the login button to authorize spotify's api. we request access to
          your top artists, top tracks, and recent tracks. you can read more
          about spotify's api{' '}
          <a
            href='https://developer.spotify.com/documentation/web-api'
            aria-label='spotify docs'
          >
            here
          </a>
          .
        </small>
      </section>
      <footer className={styles.footer}>
        <small>
          dev / design by <a href='https://www.alexchristie.dev/'>if</a>
        </small>
      </footer>
    </main>
  );
}

export default LoginPage;
