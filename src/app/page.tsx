'use client';

import React from "react";
import Image from "next/image";
import styles from "./home.module.css";
import Button from "@/components/button/Button";
import Carousel from "@/components/carousel/Carousel";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      <section className={`${styles.hero} fade-in`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Осинови, не купувай.</h1>
          <p className={styles.heroDescription}>
            Подари нов живот на животно в нужда и направи света по-добро място.
          </p>
          <div className={styles.heroActions}>
            <Button variant="contained">Научи повече</Button>
            <Button variant="outlined">Контакт</Button>
          </div>
        </div>
        <div
          className={styles.heroImage}
        >
          <Carousel />
        </div>
      </section>

      <section className={`${styles.infoGrid}`}>
        <article className={`${styles.infoCard} fade-up-delayed-1`}>
          <h3>Защо да осиновиш?</h3>
          <p>Осиновяването спасява животи. Дай шанс на животно без дом.</p>
        </article>
        <article className={`${styles.infoCard} fade-up-delayed-2`}>
          <h3>Процес на осиновяване</h3>
          <p>Лесен и ясен процес, в който ние ти помагаме на всяка стъпка.</p>
        </article>
        <article className={`${styles.infoCard} fade-up-delayed-3`}>
          <h3>Доброволчество</h3>
          <p>Присъедини се като доброволец и направи разлика всеки ден.</p>
        </article>
        <article className={`${styles.infoCard} fade-up-delayed-4`}>
          <h3>Истории с щастлив край</h3>
          <p>Прочети вдъхновяващи разкази на осиновители и техните любимци.</p>
        </article>
      </section>

      <section className={`${styles.featuredStory} fade-in`}>
        <div className={styles.storyImage}>
          <Image
            src="/girl-with-cat.jpg"
            alt="Girl with Cat"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className={styles.storyContent}>
          <h2>История на Анна и Мър</h2>
          <p>След като осинови Мър, Анна откри своя най-добър приятел. Сега са неразделни.</p>
          <Button variant="secondary">Виж още истории</Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
