import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { Appointment } from "@/types";
import HandlerFactory from "@/utils/handler-factory";
import { RequestHandler } from "express";

export const deleteAppointment: RequestHandler = HandlerFactory.create<
  { message: string },
  AuthenticatedRequest
>(
  async (req) => {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id) {
      throw new Error("No se proporcionó ID de cita");
    }

    const result = await Database.query<Appointment>(
      `DELETE FROM appointments 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, user_id],
    );

    if (!result[0]) {
      throw new Error("Cita no encontrada o no autorizada");
    }

    return { message: "Cita eliminada correctamente" };
  },
  {
    errorName: "No se pudo eliminar la cita",
  },
);
