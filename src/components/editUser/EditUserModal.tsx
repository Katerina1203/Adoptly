"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./editusermodal.module.css";

const schema = z.object({
  username: z.string().min(3, "Минимум 3 символа"),
  email: z.string().email("Невалиден имейл"),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/, {
    message: "Невалиден телефонен номер",
  }),
  img: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: FormData) => void;
  user: {
    username: string;
    email: string;
    phone?: string;
    img?: undefined;
  };
}

const EditUserModal = ({ isOpen, onClose, onSave, user }: EditUserModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
      phone: user.phone || "",
    },
  });

  const onSubmit = (data: FormData) => {
    const newData = {
      username: String(data.username),
      email: String(data.email),
      phone: String(data.phone),
    };
    console.log("Submitted data:", newData);
    onSave(newData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
        <h2 className={styles.modalTitle}>Редакция на потребител</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Име</label>
          <input {...register("username")} className={styles.formInput} placeholder="Име" />
          {errors.username && <p className={styles.formError}>{errors.username.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Имейл</label>
          <input {...register("email")} className={styles.formInput} placeholder="email@example.com" />
          {errors.email && <p className={styles.formError}>{errors.email.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Телефон</label>
          <input {...register("phone")} className={styles.formInput} placeholder="+359..." />
          {errors.phone && <p className={styles.formError}>{errors.phone.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Снимка</label>
          <input type="file" {...register("img")} accept="image/*" className={styles.formInputFile} />
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
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

export default EditUserModal;
