import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { Appointment } from "@/types";
import HandlerFactory from "@/utils/handler-class";
import { RequestHandler } from "express";

export const updateAppointment: RequestHandler = HandlerFactory.create<
  { appointment: Appointment },
  AuthenticatedRequest
>(
  async (req) => {
    const { id } = req.params;
    const { date, time } = req.body;
    const user_id = req.user.id;

    if (!id) {
      throw new Error("No se proporcionó ID de la cita");
    }

    if (!date && !time) {
      throw new Error("No se proporcionaron actualizaciones para la cita");
    }

    const existing = await Database.query<Appointment>(
      `SELECT * FROM appointments 
       WHERE id = $1 AND user_id = $2`,
      [id, user_id],
    );

    if (!existing[0]) {
      throw new Error("Cita no encontrada o no autorizada");
    }

    const conflicts = await Database.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 
       AND date = $2 
       AND time = $3`,
      [existing[0].doctor_id, date, time],
    );

    if (conflicts.length > 0) {
      throw new Error("Esta hora no está disponible");
    }

    const result = await Database.query<Appointment>(
      `UPDATE appointments 
       SET 
         date = COALESCE($1, date),
         time = COALESCE($2, time)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [date, time, id, user_id],
    );

    return { appointment: result[0] };
  },
  {
    errorName: "No se pudo actualizar la cita",
  },
);
