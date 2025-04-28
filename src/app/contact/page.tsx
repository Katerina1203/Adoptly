'use client';

import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <section className={`${styles.hero} fade-in`}>
          <h1 className={styles.title}>Свържи се с нас 🐾</h1>
          <p className={styles.subtitle}>
            Имате въпрос, предложение или искате да помогнете? Изпратете ни съобщение!
          </p>
        </section>

        <div className={styles.content}>
          <form className={`${styles.form} fade-up`}>
            <label>
              Име
              <input type="text" name="name" required />
            </label>

            <label>
              Имейл
              <input type="email" name="email" required />
            </label>

            <label>
              Съобщение
              <textarea name="message" rows={6} required />
            </label>

            <button type="submit">Изпрати 🐶</button>
          </form>

          <div className={`${styles.infoCard} fade-up-delayed-1`}>

            <h2>Контакти</h2>
            <p>📍 София, България</p>
            <p>📞 +359 888 123 456</p>
            <p>📧 contact@adoptly.bg</p>
            <p>🐾 Instagram: @adoptlybg</p>
          </div>
        </div>
      </main>
    </div>
  );
}
