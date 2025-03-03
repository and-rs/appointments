import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { Appointment } from "@/types";
import HandlerFactory from "@/utils/handler";
import { RequestHandler } from "express";

export const deleteAppointment: RequestHandler = HandlerFactory.create<
  { message: string },
  AuthenticatedRequest
>(
  async (req) => {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id) {
      throw new Error("No appointment id provided");
    }

    const result = await Database.query<Appointment>(
      `DELETE FROM appointments 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, user_id],
    );

    if (!result[0]) {
      throw new Error("Appointment not found or unauthorized");
    }

    return { message: "Appointment deleted successfully" };
  },
  {
    errorName: "Failed to delete appointment",
  },
);
