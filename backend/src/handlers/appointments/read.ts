import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { Appointment } from "@/types";
import HandlerFactory from "@/utils/handler-class";
import { RequestHandler } from "express";

export const readAppointments: RequestHandler = HandlerFactory.create<
  { appointments: Appointment[] },
  AuthenticatedRequest
>(
  async (req) => {
    const user_id = req.user.id;

    const result = await Database.query<Appointment>(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.user_id = $1
       ORDER BY a.date ASC, a.time ASC`,
      [user_id],
    );

    return { appointments: result };
  },
  {
    errorName: "No se pudieron obtener las citas",
  },
);
