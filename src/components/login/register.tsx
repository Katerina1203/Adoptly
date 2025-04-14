'use client';

import styles from './authForm.module.css';

export default function RegisterForm() {
  return (
    <form className={`fade-up ${styles.form}`}>
      <h2 className={styles.title}>Регистрация</h2>
      <label>
        Име
        <input type="text" required />
      </label>
      <label>
        Имейл
        <input type="email" required />
      </label>
      <label>
        Парола
        <input type="password" required />
      </label>
      <button type="submit">Регистрирай се 🐶</button>
    </form>
  );
}