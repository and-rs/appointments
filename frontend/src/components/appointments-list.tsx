import { Appointment } from "@/lib/types";
import { Calendar, ClipboardPlus, Clock, Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
  appointments: Appointment[];
}

export default function AppointmentsList({ appointments }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Mis Citas</h2>
      </div>

      {appointments.map ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden p-0">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:justify-between sm:h-[65px]">
                  <h3 className="text-lg font-semibold sm:self-center">
                    {appointment.doctor_id}
                  </h3>

                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 sm:px-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 size-4 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 size-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <ClipboardPlus className="mr-2 size-4 text-muted-foreground" />
                      <span>specialty</span>
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
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
