import { Appointment } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ClipboardPlus, Clock, Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
  result: { appointments: Appointment[] };
}

export default function AppointmentsList({ result }: Props) {
  const appointments = result.appointments;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Mis Citas</h2>
      </div>

      {appointments.map ? (
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
                      {appointments
                        ? format(appointments[0].date, "PPP", {
                            locale: es,
                          })
                        : "Ups! No hay fecha"}
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
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none"
                >
                  <Edit className="mr-2 size-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 md:flex-none"
                >
                  <Trash className="mr-2 size-4" />
                  Cancelar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
