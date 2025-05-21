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
  };
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ userId, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (updatedUser: {
    username: string;
    email: string;
    phone?: string;
  }) => {
    await updateUser({
      userId,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });

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
        user={{
          username: user.username,
          email: user.email,
          phone: user.phone || "",
        }}
      />
    </>
  );
};

export default EditUserButton;
