import { Appointment } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  result: { appointments: Appointment[] };
}

export default function StatCard({ result }: Props) {
  const appointments = result.appointments;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointments?.length}</div>
          <p className="text-xs text-muted-foreground">
            {appointments?.length === 1
              ? "Tienes 1 cita programada"
              : `Tienes ${appointments.length} citas programadas`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {appointments.length > 0 ? appointments[0]?.time : "-"}
          </div>
          <p className="text-xs text-muted-foreground">
            {appointments.length > 0
              ? format(appointments[0]?.created_at, "PPP", { locale: es })
              : "No tienes citas próximas."}
            &nbsp;{appointments[0]?.doctor_name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
