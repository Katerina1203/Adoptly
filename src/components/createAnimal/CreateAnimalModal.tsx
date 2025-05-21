"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { createAnimalPost } from "@/lib/actions";
import React, { useState } from "react";
import AddAnimalForm from "../forms/AddAnimalForm";
import styles from "./createanimalmodal.module.css";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NestedModal = ({ open, setOpen }: Props) => {
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const validateAge = (age: number) => {
    if (age < 0 || age > 20 || !Number.isInteger(Number(age))) {
      return "Възрастта трябва да е цяло число между 0 и 20";
    }
    return "";
  };

  const handleAgeChange = (event: any) => {
    setAge(event.target.value);
    const errorMessage = validateAge(Number(event.target.value));
    setAgeError(errorMessage);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const errorMessage = validateAge(Number(age));
    if (errorMessage) {
      setAgeError(errorMessage);
      return;
    }

    await createAnimalPost(formData);
    handleClose();
  };

  return (
    <div className={styles.modalWrapper}>
      <Dialog
        open={open}
        onOpenChange={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Информация за животинчето</DialogTitle>
            <DialogDescription>
              Попълнете данните за вашето животинче
            </DialogDescription>
          </DialogHeader>

          <AddAnimalForm close={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NestedModal;
