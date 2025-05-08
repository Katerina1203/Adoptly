"use client";

import React from "react";
import Image from "next/image";
import styles from "./home.module.css";
import Button from '@mui/material/Button';
import Carousel from "@/components/carousel/Carousel";

const images = [
  { src: "/two-kittens.jpg", alt: "Two Kittens" },
  { src: "/girl-with-cat.jpg", alt: "Girl with Cat" },
  { src: "/family-with-dog.jpg", alt: "Family with Dog" }
];
const Home = () => {
  return (
    <main className={styles.wrapper}>
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Осинови, не купувай.</h1>
        <p className={styles.heroDescription}>
          Подари нов живот на животно в нужда и направи света по-добро място.
        </p>
        <div className={styles.heroActions}>
          <Button variant="contained" color="primary">Научи повече</Button>
          <Button variant="outlined" color="primary">Контакт</Button>
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "600px", height: "400px", position: "relative" }}>
        <Carousel  />
      </div>
    </section>
    <section className={styles.infoGrid}>
        <article className={styles.infoCard}>
          <h3>Защо да осиновиш?</h3>
          <p>Осиновяването спасява животи. Дай шанс на животно без дом.</p>
        </article>
        <article className={styles.infoCard}>
          <h3>Процес на осиновяване</h3>
          <p>Лесен и ясен процес, в който ние ти помагаме на всяка стъпка.</p>
        </article>
        <article className={styles.infoCard}>
          <h3>Доброволчество</h3>
          <p>Присъедини се като доброволец и направи разлика всеки ден.</p>
        </article>
        <article className={styles.infoCard}>
          <h3>Истории с щастлив край</h3>
          <p>Прочети вдъхновяващи разкази на осиновители и техните любимци.</p>
        </article>
      </section>

      <section className={styles.featuredStory}>
        <div className={styles.storyImage}>
          <Image src="/girl-with-cat.jpg" alt="Girl with Cat" width={500} height={350} />
        </div>
        <div className={styles.storyContent}>
          <h2>История на Анна и Мър</h2>
          <p>След като осинови Мър, Анна откри своя най-добър приятел. Сега са неразделни.</p>
          <Button variant="contained" color="secondary">Виж още истории</Button>
        </div>
        </section>

     
</main>
);
};

export default Home;