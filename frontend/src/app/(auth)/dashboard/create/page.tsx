"use client";

import appointmentsFormSchema from "@/components/appointments/appointments-schema";
import DatePicker from "@/components/appointments/date-picker";
import DoctorSelect from "@/components/appointments/doctor-select";
import SpecialtySelect from "@/components/appointments/specialty-select";
import TimeSelect from "@/components/appointments/time-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { api } from "@/lib/axios";
import { AuthResponse, Doctor } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as z from "zod";

export default function CreateAppointment() {
  const { data } = useSWR("/doctors/read", (url) => api.fetch<Doctor[]>(url));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof appointmentsFormSchema>>({
    resolver: zodResolver(appointmentsFormSchema),
    defaultValues: {
      date: new Date(),
      doctor: "",
      specialty: "",
      time: "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const handleSubmit = async (
    values: z.infer<typeof appointmentsFormSchema>,
  ) => {
    setError(null);
    setSuccessMessage(null);
    const formattedDate = values.date
      ? new Date(values.date).toISOString().slice(0, 10)
      : null;

    const appointment = {
      doctor_id: values.doctor,
      date: formattedDate,
      time: values.time,
    };

    const { data, error } = await api.request<AuthResponse>(
      "/appointments/create",
      { method: "post", data: appointment, requiresAuth: true },
    );

    if (error) {
      setError(error.message);
      return;
    }

    if (data.result) {
      setSuccessMessage("Cita creada con exito!");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crear Nueva Cita</h1>
        <p className="text-muted-foreground">
          Programa una nueva cita con nuestros especialistas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
          <CardDescription>
            Completa la información para agendar tu cita
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DatePicker control={form.control} />
              <TimeSelect control={form.control} />
              <SpecialtySelect control={form.control} data={data!} />
              <DoctorSelect control={form.control} data={data!} />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting}
              >
                {!error && !successMessage ? "Agendar" : null}
                {error && (
                  <>
                    {error} <X />
                  </>
                )}
                {successMessage && (
                  <>
                    {successMessage} <Check />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
