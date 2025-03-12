"use client";

import ApiClient from "@/lib/axios";
import { Appointment } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ClipboardPlus, Clock, Trash } from "lucide-react";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface Props {
  result: { appointments: Appointment[] };
  mutate: KeyedMutator<{ result: { appointments: Appointment[] } }>;
}

export default function AppointmentsList({ result, mutate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const appointments = result.appointments;

  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await ApiClient.request<{ message: string }>(
      `/appointments/delete/${appointmentId}`,
      {
        method: "delete",
        requiresAuth: true,
      },
    );

    if (error) {
      setError(error.message);
    } else {
      await mutate();
      setSuccessMessage("Cita cancelada con éxito!");
    }

    setIsLoading(false);
  };

  if (appointments.length === 0) {
    return (
      <span className="text-xl text-muted-foreground">
        No tienes citas agendadas!
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Mis Citas</h2>
      </div>

      {error && <div className="text-red-400">{error}</div>}
      {successMessage && <div className="text-green-400">{successMessage}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden gap-0 p-0">
            <div className="flex flex-col gap-2 p-4">
              <h3 className="text-lg font-semibold">
                {appointment.doctor_name}
              </h3>

              <div className="flex flex-row gap-4">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 size-4 text-muted-foreground" />
                  <span>
                    {format(new Date(appointment.date), "PPP", {
                      locale: es,
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="mr-2 size-4 text-muted-foreground" />
                  <span>{appointment.time}</span>
                </div>

                <div className="flex items-center text-sm">
                  <ClipboardPlus className="mr-2 size-4 text-muted-foreground" />
                  <span>{appointment.doctor_specialty}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end p-4 border-t bg-muted/50">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={() => handleDeleteAppointment(appointment.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Cancelando..."
                ) : (
                  <>
                    <Trash className="mr-2 size-4" />
                    Cancelar
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
