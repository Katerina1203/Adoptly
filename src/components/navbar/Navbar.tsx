'use client';
import Link from 'next/link';
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Adoptly<span className={styles.paw}>🐾</span></Link>
      </div>
      <nav className={styles.navLinks}>
        <Link href="/">Начало</Link>
        <Link href="/about">За нас</Link>
        <Link href="/adopt">Осинови</Link>
        <Link href="/contact">Контакт</Link>
        <Link href="/login">Регистрация</Link>
      </nav>
    </header>
  );
};

export default Navbar;
