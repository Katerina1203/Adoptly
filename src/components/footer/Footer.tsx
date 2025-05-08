'use client';
import styles from './footer.module.css';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link href="/">Начало</Link>
        <Link href="/about">За нас</Link>
        <Link href="/adopt">Осинови</Link>
        <Link href="/volunteer">Доброволчество</Link>
        <Link href="/contact">Контакт</Link>
        <p>© {new Date().getFullYear()} Adoptly. Всички права запазени.</p>
      </div>
    </footer>
  );
};

export default Footer;