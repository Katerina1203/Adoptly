import Link from 'next/link';
import styles from './navbar.module.css';

import { auth } from "@/auth"
import { getUser } from "@/lib/data";

const Navbar = async () => {
  const session = await auth();
  const dbUser = await getUser(session?.user?.email!)

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Adoptly<span className={styles.paw}>🐾</span></Link>
      </div>
      <nav className={styles.navLinks}>
        <Link href="/">Начало</Link>
        <Link href="/about">За нас</Link>
        <Link href="/animals">Осинови</Link>
        <Link href="/contact">Контакт</Link>
        {session ?
          <Link href="/user">Профил</Link>
          :
          <Link href="/login">Регистрация</Link>
        }
      </nav>
    </header>
  );
};

export default Navbar;
