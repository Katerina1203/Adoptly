import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Кои сме ние?</h1>
          <p className={styles.subtitle}>
            Ние сме екип от доброволци, които вярват, че всяко животно заслужава втори шанс.
          </p>
        </section>

        <section className={styles.content}>
          <div className={`${styles.card} fade-up-delayed-1`}>
            <div className={styles.cardIcon}>❤️</div>
            <h2>Мисията ни</h2>
            <p>Нашата цел е да намерим любящ дом за бездомни животни чрез създаване на сигурна и достъпна платформа.</p>
          </div>

          <div className={`${styles.card} fade-up-delayed-2`}>
            <div className={styles.cardIcon}>📅</div>
            <h2>Какво правим</h2>
            <p>Организираме събития за осиновяване, образователни кампании и съдействаме на приюти в цялата страна.</p>
          </div>

          <div className={`${styles.card} fade-up-delayed-3`}>
            <div className={styles.cardIcon}>🤝</div>
            <h2>Доброволци</h2>
            <p>Нашите доброволци са в сърцето на всичко. Те вдъхват надежда, грижа и любов на всяко животно.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
