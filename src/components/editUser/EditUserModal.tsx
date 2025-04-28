"use client";

import React, { useState } from "react";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: { username: string; email: string }) => void;
    user: { username: string; email: string };
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ username, email });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;