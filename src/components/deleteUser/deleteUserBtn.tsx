"use client";

import React, { useState } from "react";
import DeleteUserModal from "./deleteUserModal";
import { deleteUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import styles from "./deleteuser.module.css";

interface DeleteUserButtonProps {
    userId: string;
    username: string;
    onUserDeleted?: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, username, onUserDeleted }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append("id", userId);

        await deleteUser(formData);

        if (onUserDeleted) onUserDeleted();

        setIsModalOpen(false);
        router.push("/user");
    };

    return (
        <>
            <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => setIsModalOpen(true)}
            >
                Изтрий
            </button>

            <DeleteUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDelete}
                username={username}
            />
        </>
    );
};

export default DeleteUserButton;
