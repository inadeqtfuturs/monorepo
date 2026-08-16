import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import styles from './index.module.css';
import ThemeProvider from './ThemeContext';
import ToggleTheme from './ToggleTheme';

const menuConfig = [
  { label: 'writing', href: '/garden' },
  /* { label: 'projects', href: '/projects' }, */
  { label: 'changelog', href: '/changelog' },
  { label: 'about', href: '/whoami' },
];

const footerMenu = [
  { href: 'https://github.com/inadeqtfuturs', label: 'github' },
  {
    href: 'https://bsky.app/profile/ifqux.bsky.social',
    label: 'bluesky',
  },
];

function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <header className={styles.sharedLayout}>
        <Link href='/' aria-label='home' className={styles.branding}>
          home
        </Link>
        <nav>
          <ul>
            {menuConfig.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
      <footer className={styles.sharedLayout}>
        <nav>
          <ul>
            {footerMenu.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={styles.link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ToggleTheme />
      </footer>
    </ThemeProvider>
  );
}

export default Layout;
