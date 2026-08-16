'use client';
import classname from '@if/ui/utils/classname';
import React, { useState } from 'react';
import FavoritesTable from '@/components/FavoritesTable';
import { logout } from '@/lib/spotify';
import styles from './index.module.css';

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <main className={styles.wrapper}>
      <aside className={classname([styles.aside, open && styles.open])}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <a href='#favorites'>favorites</a>
            </li>
          </ul>
        </nav>
        <button
          type='button'
          className={styles.logoutButton}
          onClick={async () => await logout()}
        >
          logout
        </button>
      </aside>
      <section>
        <FavoritesTable asideState={{ open, setOpen }} />
      </section>
    </main>
  );
}

export default DashboardLayout;
