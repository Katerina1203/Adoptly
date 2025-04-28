import React from "react";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    username: string; // Optional: Display the username in the modal
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onDelete, username }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Delete User</h2>
                <p className="mb-4">
                    Are you sure you want to delete the user <strong>{username}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;