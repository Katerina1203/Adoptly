"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EditAnimalModal from "./EditAnimalModal";
import { updateAnimal } from "@/lib/actions";
import styles from "./editanimalbutton.module.css";

interface EditAnimalButtonProps {
  animal: {
    _id: string;
    description: string;
    type: string;
    age: string;
    city: string;
    gender: string;
  };
}

const EditAnimalButton: React.FC<EditAnimalButtonProps> = ({ animal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (updatedAnimal: {
    description: string;
    type: string;
    age: string;
    city: string;
    gender: string;
  }) => {
    await updateAnimal({
      id: animal._id,
      ...updatedAnimal,
    });

    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        className={styles.editButton}
        onClick={() => setIsModalOpen(true)}
      >
        Редактирай
      </button>

      <EditAnimalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        animal={animal}
      />
    </>
  );
};

export default EditAnimalButton;
