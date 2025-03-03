"use client";

import AppointmentsList from "@/components/appointments-list";
import StatCard from "@/components/stat-card";
import { Appointment } from "@/lib/types";
import { useState } from "react";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctor_id: "Dr. García",
    date: "2025-03-04",
    time: "10:00 AM",
  },
  {
    id: "2",
    doctor_id: "Dra. Rodríguez",
    date: "2025-03-10",
    time: "3:30 PM",
  },
  {
    id: "3",
    doctor_id: "Dr. Martínez",
    date: "2025-03-15",
    time: "11:15 AM",
  },
];

export default function Dashboard() {
  const [appointments] = useState(mockAppointments);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, Usuario
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus citas médicas desde un solo lugar
        </p>
      </div>

      <StatCard appointments={appointments} />
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
