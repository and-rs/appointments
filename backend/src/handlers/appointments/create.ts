import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { Appointment } from "@/types";
import HandlerFactory from "@/utils/handler";
import { RequestHandler } from "express";

export const createAppointment: RequestHandler = HandlerFactory.create<
  { appointment: Appointment },
  AuthenticatedRequest
>(
  async (req) => {
    const { doctor_id, date, time } = req.body;
    const user_id = req.user.id;

    if (!doctor_id || !date || !time) {
      throw new Error("Missing required fields");
    }

    const doctorExists = await Database.query(
      "SELECT id FROM doctors WHERE id = $1",
      [doctor_id],
    );

    if (!doctorExists[0]) {
      throw new Error("Doctor not found");
    }

    const conflicts = await Database.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 
       AND date = $2 
       AND time = $3`,
      [doctor_id, date, time],
    );

    if (conflicts.length > 0) {
      throw new Error("This time slot is not available");
    }

    const result = await Database.query<Appointment>(
      `INSERT INTO appointments (user_id, doctor_id, date, time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, doctor_id, date, time],
    );

    return { appointment: result[0] };
  },
  {
    errorName: "Failed to create appointment",
    successStatus: 201,
  },
);
