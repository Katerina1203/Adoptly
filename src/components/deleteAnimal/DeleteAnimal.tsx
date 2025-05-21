"use client";

import { useState } from "react";

type Props = {
    animalId: string;
    deleteAction: (formData: FormData) => void;
};

const DeleteAnimalForm = ({ animalId, deleteAction }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        setSubmitting(true);
        const form = document.getElementById("delete-animal-form") as HTMLFormElement;
        if (form) form.requestSubmit();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Изтрий
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md text-center space-y-4">
                        <h2 className="text-xl font-semibold">Потвърди изтриване</h2>
                        <p>Сигурни ли сте, че искате да изтриете обявата?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Отказ
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                disabled={submitting}
                            >
                                {submitting ? "Изтриване..." : "Изтрий"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form
                id="delete-animal-form"
                action={deleteAction}
                className="hidden"
            >
                <input type="hidden" name="id" value={animalId} />
            </form>
        </>
    );
};

export default DeleteAnimalForm;
