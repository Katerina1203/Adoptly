'use client';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <section className="fade-in">
          <h1 className={styles.title}>Кои сме ние?</h1>
          <p className={styles.subtitle}>
            Ние сме екип от доброволци, които вярват, че всяко животно заслужава втори шанс.
          </p>
        </section>

        <section className={`${styles.content}`}>
          <div className={`fade-up-delayed-1 ${styles.card}`}>
            <h2>Мисията ни</h2>
            <p>Нашата цел е да намерим любящ дом за бездомни животни...</p>
          </div>

          <div className={`fade-up-delayed-2 ${styles.card}`}>
            <h2>Какво правим</h2>
            <p>Организираме събития за осиновяване...</p>
          </div>

          <div className={`fade-up-delayed-3 ${styles.card}`}>
            <h2>Доброволци</h2>
            <p>Нашите доброволци са в сърцето на нашата инициатива...</p>
          </div>
        </section>
      </main>
    </div>
  );
}
