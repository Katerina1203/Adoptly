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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import PasswordVisibleToggle from "@/components/ui/toggle-password";
import { Label } from "@/components/ui/label";
import { createAnimalPost } from "@/lib/actions";

const formSchema = z.object({
    description: z.string().min(5, {
        message: "Please enter description",
    }),
    type: z.string().min(3, {
        message: "No type",
    }),
    age: z.string(),
    city: z.string(),
    gender: z.string().min(2, {
        message: "No gender",
    }),
    file: z
        .any()
        .refine((files) => files?.length > 0, {
            message: "At least one image is required.",
        }),
});

type Props = {
    close: () => void
};

export default function AddAnimalForm({close }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            type: "",
            age: "",
            city: "",
            gender: "",
            file: [],
        },
    });


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            form.setValue("file", Array.from(files)); // Store the files in form state
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData();
            formData.append("description", values.description);
            formData.append("type", values.type);
            formData.append("age", values.age);
            formData.append("city", values.city);
            formData.append("gender", values.gender);
            if (values.file.length) {
                values.file.forEach((file: File) => {
                    formData.append("file", file);
                });
            }
            createAnimalPost(formData)
            setError("");
            close();
            router.refresh();
        } catch (e) {
            console.error(e);
            setError("Something went wrong!");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                {error !== "" && <p className="text-red-400">{error}</p>}
               
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
                                <Input  type="number" {...field} />
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
                                <Input  type="text" {...field} />
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
                                <Input type="text" {...field} />
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
                            <FormLabel>Информация за животинчто</FormLabel>
                            <FormControl>
                                <textarea className="w-full h-[80px]" {...field} />
                            </FormControl>
                       
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Добавете снимки</FormLabel>
                    <FormControl>
                        <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                    </FormControl>
                
                    <FormMessage />
                </FormItem>
                <Button type="submit">Добави</Button>
            </form>
        </Form>
    );
}
