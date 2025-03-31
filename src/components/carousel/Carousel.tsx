"use client";
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import styles from './carousel.module.css';

const filteredItems = [
  {
    id: 1,
    img: "https://www.aspca.org/sites/default/files/how-you-can-help_adoptions-tips_main-image-dog.jpg",
    description: "Adopt a furry friend today!",
  },
  {
    id: 2,
    img: "https://rspca.sfo2.cdn.digitaloceanspaces.com/public/Uploads/adopt-a-pet-adopting-a-dog-selecting-your-dog__FocusFillWzE0NzIsNjI0LCJ5IiwxMDFd.jpg",
    description: "Find your perfect pet!",
  },
  {
    id: 3,
    img: "https://www.unioncountysheriffsoffice.com/home/showpublishedimage/1952/637728311968300000",
    description: "Beautiful animals looking for a home.",
  },
  {
    id: 4,
    img: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
    description: "Cats of all kinds available.",
  },
];

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <Box className={styles.carouselContainer}>
      <Box className={styles.carousel}>
        {filteredItems.map((item, index) => (
          <Box
            key={item.id}
            className={`${styles.card} ${
              index === currentIndex ? styles.active : styles.hidden
            }`}
          >
            <img
              src={item.img}
              alt={`Image ${item.id}`}
              className={styles.cardImage}
            />
            <Box className={styles.cardContent}>
              <p className={styles.description}>{item.description}</p>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className={styles.indicatorContainer}>
        {filteredItems.map((_, index) => (
          <Box
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.activeIndicator : ""
            }`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CarouselComponent;
