'use client';

import styles from './button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'contained',
  onClick,
  type = 'button',
}: ButtonProps) {
  const classes = [styles.button];

  if (variant === 'outlined') classes.push(styles.outlined);
  if (variant === 'secondary') classes.push(styles.secondary);

  return (
    <button className={classes.join(' ')} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
