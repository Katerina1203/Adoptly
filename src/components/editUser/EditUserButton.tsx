"use client";

import React, { useState } from "react";
import EditUserModal from "./EditUserModal";
import { updateUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import styles from "./edituser.module.css";

interface EditUserButtonProps {
  userId: string;
  user: {
    username: string;
    email: string;
    phone?: string;
    img?: string;
  };
  onUserUpdated?: (updatedUser: { username: string; email: string; phone?: string; img?: string }) => void;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ userId, user, onUserUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (updatedUser: { username: string; email: string; phone?: string; img?: File | null }) => {
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("username", updatedUser.username);
    formData.append("email", updatedUser.email);
    if (updatedUser.phone) formData.append("phone", updatedUser.phone);
    if (updatedUser.img) formData.append("img", updatedUser.img);

    await updateUser(formData);

    if (onUserUpdated) {
      onUserUpdated({ ...updatedUser, img: undefined }); 
    }

    setIsModalOpen(false);
    router.refresh(); 
  };

  return (
    <>
      <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>
        Редактирай
      </button>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={user}
      />
    </>
  );
};

export default EditUserButton;
