"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { AuthResponse } from "@/lib/types";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(50, { message: "El nombre no puede tener más de 50 caracteres" })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "El nombre solo puede contener letras y espacios",
      }),
    email: z
      .string()
      .email({ message: "Dirección de correo electrónico no válida" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string().min(8, {
      message: "La confirmación de contraseña debe tener al menos 8 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await fetcher<AuthResponse>("/users/create", {
      method: "post",
      data: values,
    });
    if (error) {
      setError(error.message);
    }
    if (data) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Perez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="ejemplo@correo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input id="signup_password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input id="confirmPassword" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {error ? error : "Registrarse"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
