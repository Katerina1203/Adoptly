"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Редактирай обявата</h2>

        <div className="mb-4">
          <label className="block mb-1">Възраст</label>
          <input
            {...register("age" as const)}
            className="w-full border p-2 rounded"
            inputMode="numeric"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Град</label>
          <input {...register("city" as const)} className="w-full border p-2 rounded" />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Описание</label>
          <textarea
            {...register("description" as const)}
            className="w-full border p-2 rounded h-24"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отказ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Запази
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnimalModal;
