import * as z from "zod";

const appointmentsFormSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
    invalid_type_error: "Fecha inválida.",
  }),
  time: z
    .string({
      required_error: "La hora es requerida.",
    })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Hora inválida. Formato HH:MM (24 horas).",
    })
    .refine(
      (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      },
      {
        message:
          "Hora inválida.  Asegúrese de que la hora y los minutos sean válidos.",
      },
    ),
  specialty: z
    .string({
      required_error: "La especialidad es requerida.",
    })
    .min(3, { message: "La especialidad debe tener al menos 3 caracteres." }),
  doctor: z
    .string({
      required_error: "Seleccionar doctor es requerido.",
    })
    .min(3, {
      message: "El doctor seleccionado debe tener al menos 3 caracteres.",
    }),
});

export default appointmentsFormSchema;
