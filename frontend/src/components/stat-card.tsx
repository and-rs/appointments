import { Appointment } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  appointments: Appointment[];
}

export default function StatCard({ appointments }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointments.length}</div>
          <p className="text-xs text-muted-foreground">
            {appointments.length === 1
              ? "Tienes 1 cita programada"
              : `Tienes ${appointments.length} citas programadas`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointments[0]?.time}</div>
          <p className="text-xs text-muted-foreground">
            {appointments[0]?.date} - {appointments[0]?.doctor_id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
