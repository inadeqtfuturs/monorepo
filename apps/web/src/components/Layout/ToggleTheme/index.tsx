'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import styles from './index.module.css';

function ToggleTheme() {
  const { isClient, theme, toggleTheme } = useContext(ThemeContext);

  if (!isClient) {
    return (
      <button type='button' className={styles.toggle}>
        loading
      </button>
    );
  }

  return (
    <button type='button' onClick={toggleTheme} className={styles.toggle}>
      {theme}
    </button>
  );
}

export default ToggleTheme;
