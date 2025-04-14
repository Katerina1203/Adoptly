'use client';

import { useState } from 'react';
import LoginForm from '@/components/login/login';
import RegisterForm from '@/components/login/register';
import styles from './auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleButtons}>
        <button
          className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button
          className={`${styles.toggleButton} ${!isLogin ? styles.active : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>

      <div className={styles.formContainer}>
        {isLogin && (
          <div className={styles.formWrapper}>
            <LoginForm />
          </div>
        )}
        {!isLogin && (
          <div className={styles.formWrapper}>
            <RegisterForm />
          </div>
        )}
      </div>
    </div>
  );
}