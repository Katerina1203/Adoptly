"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createAnimalPost } from "@/lib/actions";

const formSchema = z.object({
  description: z.string().min(5, {
    message: "Моля въведете описание",
  }),
  type: z.string().min(3, {
    message: "Въведете вид",
  }),
  age: z.preprocess(
    (val) => Number(val),
    z
      .number({
        invalid_type_error: "Въведете валидна възраст",
      })
      .min(0, { message: "Минимална възраст: 0" })
      .max(20, { message: "Максимална възраст: 20" })
  ),
  city: z.string().min(2, { message: "Въведете местоположение" }),
  gender: z.enum(["мъжки", "женски"], {
    errorMap: () => ({
      message: "Изберете пол",
    }),
  }),
  file: z
    .any()
    .refine((files) => files?.length > 0, {
      message: "Изисква се поне една снимка",
    }),
});

type Props = {
  close: () => void;
};

export default function AddAnimalForm({ close }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      type: "",
      age: 0,
      city: "",
      gender: "мъжки",
      file: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      form.setValue("file", Array.from(files));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("type", values.type);
      formData.append("age", values.age.toString());
      formData.append("city", values.city);
      formData.append("gender", values.gender);
      values.file.forEach((file: File) => {
        formData.append("file", file);
      });

      await createAnimalPost(formData);
      setError("");
      close();
      router.refresh();
    } catch (e) {
      console.error(e);
      setError("Възникна грешка при създаване на обявата.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вид</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Възраст</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={20} step={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Местоположение</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пол</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="мъжки">Мъжки</option>
                  <option value="женски">Женски</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <textarea className="w-full h-20 p-2 border rounded" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Снимки</FormLabel>
          <FormControl>
            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="pt-2">
          <Button type="submit">Добави</Button>
        </div>
      </form>
    </Form>
  );
}
