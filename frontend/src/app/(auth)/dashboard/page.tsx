"use client";

import AppointmentsList from "@/components/appointments-list";
import StatCard from "@/components/stat-card";
import { api } from "@/lib/axios";
import { Appointment } from "@/lib/types";
import { Loader } from "lucide-react";
import useSWR from "swr";

export default function Dashboard() {
  const { data } = useSWR("/appointments/read", (url) =>
    api.fetch<{ result: { appointments: Appointment[] } }>(url, {
      requiresAuth: true,
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido,</h1>
        <p className="text-muted-foreground">
          Gestiona tus citas médicas desde un solo lugar
        </p>
      </div>

      {data ? (
        <>
          <StatCard result={data.result} />
          <AppointmentsList result={data.result} />
        </>
      ) : (
        <Loader className="animate-spin" />
      )}
    </div>
  );
}
