"use client"
import { useState } from "react"
import { useRouter } from "next/navigation";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import PasswordVisibleToggle from "@/components/ui/toggle-password"
import { getUserWithCredentials } from "@/lib/actions"

const formSchema = z.object({
    username: z.string().min(5, {
        message: "Username must be at least 5 characters.",
    }),
    email: z.string().email().min(10, {
        message: "Email must be at least 10 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
        message: "Confirm Password must match Password."
    }),
    phone: z.string().regex(/^\+?[0-9]{8,15}$/, {
        message: "Моля, въведете валиден телефонен номер."
    }),
});


type Props = {
    toggleForm: () => void
}

export default function RegisterForm({ toggleForm }: Props) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [error, setError] = useState<string>("");

    const handleTogglePassword = () => setShowPassword(p => !p)
    const handleToggleConfirmPassword = () => setShowConfirmPassword(p => !p)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
    });
    

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.password !== values.confirmPassword) {
            setError("Passwords must match");
            return;
        }
        try {
            const response = await fetch(`/api/register`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    phone: values.phone
                })
                
            });

            response.status === 201 && router.push("/");
        } catch (e) {
            console.error(e);
            setError("Incorrect credentials!");
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {error !== "" && <p className="text-red-400">{error}</p>}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your username.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" type="email"{...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Телефон</FormLabel>
            <FormControl>
                <Input placeholder="+359..." type="tel" {...field} />
            </FormControl>
            <FormDescription>
                Моля, въведете вашия телефонен номер.
            </FormDescription>
            <FormMessage />
        </FormItem>
    )}
/>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input placeholder="password" type={showPassword ? "text" : "password"} {...field} />
                                    <PasswordVisibleToggle setVisible={handleTogglePassword} />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Enter your password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input placeholder="confirm password" type={showConfirmPassword ? "text" : "password"} {...field} />
                                    <PasswordVisibleToggle setVisible={handleToggleConfirmPassword} />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Enter your password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Button type="submit">Създай</Button>
                    <p className="text-sm">
                        Имате акаунт ?
                        <button onClick={toggleForm} className="text-blue-500">Вход</button>
                    </p>
                </div>
            </form>
        </Form>
    )
}