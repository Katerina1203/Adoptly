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

type Props = {
    toggleForm: () => void
}

const formSchema = z.object({
    email: z.string().min(10, {
        message: "email must be at least 10 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 3 characters.",
    }),

})

export default function LoginForm({ toggleForm }: Props) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [error, setError] = useState<string>("");

    const handleTogglePassword = () => setShowPassword(p => !p)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await getUserWithCredentials(values);

            if (!!response.error) {
                console.error(response.error);
                setError(response.error.message);
            } else {
                router.push("/");
            }
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" type="email"{...field} />
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
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Button type="submit">Submit</Button>
                    <p className="text-sm">
                        Нямате акаунт?
                        <button onClick={toggleForm} className="text-blue-500">Създайте акаунт</button>
                    </p>
                </div>
            </form>
        </Form>
    )
}