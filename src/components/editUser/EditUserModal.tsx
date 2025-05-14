"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    img?: undefined; // Ensure no File object gets passed
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
    }
    console.log("Submitted data:", newData);
    onSave(newData);
    onClose();
  };
  
  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Редакция на потребител</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Име</label>
          <input
            {...register("username")}
            className="w-full px-3 py-2 border rounded"
            placeholder="Име"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Имейл</label>
          <input
            {...register("email")}
            className="w-full px-3 py-2 border rounded"
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            {...register("phone")}
            className="w-full px-3 py-2 border rounded"
            placeholder="+359..."
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Снимка</label>
          <input
            type="file"
            {...register("img")}
            accept="image/*"
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Отказ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#5c4d7d] text-white rounded hover:bg-[#483e70]"
          >
            Запази
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
