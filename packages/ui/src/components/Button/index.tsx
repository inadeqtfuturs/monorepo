'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';
import classname from '../../utils/classname';
import styles from './Button.module.css';

type ButtonProps = PropsWithChildren & {
  onClick?: () => void;
  className?: string;
};

function Button({ children, className, onClick = () => {} }: ButtonProps) {
  return (
    <button
      type='button'
      className={classname([className, styles.button])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
