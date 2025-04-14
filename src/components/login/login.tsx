'use client';

import styles from './authForm.module.css';

export default function LoginForm() {
  return (
    <form className={`fade-up ${styles.form}`}>
      <h2 className={styles.title}>Вход</h2>
      <label>
        Имейл
        <input type="email" required />
      </label>
      <label>
        Парола
        <input type="password" required />
      </label>
      <button type="submit">Влез 🐾</button>
    </form>
  );
}