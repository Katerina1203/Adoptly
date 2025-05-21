"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./editanimalmodal.module.css";

const schema = z.object({
  description: z.string().min(10, "Минимум 10 символа"),
  type: z.string().min(2),
  age: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 20, {
      message: "Възрастта трябва да е между 0 и 20",
    }),
  city: z.string().min(2),
  gender: z.enum(["мъжки", "женски"]),
});

type FormData = z.infer<typeof schema>;

interface EditAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAnimal: FormData) => void;
  animal: {
    _id: string;
    description: string;
    type: string;
    age: string;
    city: string;
    gender: string;
  };
}

const EditAnimalModal = ({ isOpen, onClose, onSave, animal }: EditAnimalModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: animal.description,
      type: animal.type,
      age: animal.age,
      city: animal.city,
      gender: animal.gender as "мъжки" | "женски",
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
        <h2 className={styles.modalTitle}>Редактирай обявата</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Възраст</label>
          <input
            {...register("age")}
            className={styles.formInput}
            inputMode="numeric"
          />
          {errors.age && <p className={styles.formError}>{errors.age.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Град</label>
          <input {...register("city")} className={styles.formInput} />
          {errors.city && <p className={styles.formError}>{errors.city.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Описание</label>
          <textarea
            {...register("description")}
            className={`${styles.formInput} ${styles.textArea}`}
          ></textarea>
          {errors.description && <p className={styles.formError}>{errors.description.message}</p>}
        </div>

        <div className={styles.modalActions}>
          <button type="button" onClick={onClose} className={styles.btnCancel}>
            Отказ
          </button>
          <button type="submit" className={styles.btnSubmit}>
            Запази
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnimalModal;
