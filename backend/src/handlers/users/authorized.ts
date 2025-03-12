import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import HandlerFactory from "@/utils/handler-factory";
import { RequestHandler } from "express";

interface AuthorizedUser {
  user: {
    id: string;
    email: string;
    name: string;
    created_at: string;
  };
}

export const authorizedUser: RequestHandler = HandlerFactory.create<
  AuthorizedUser,
  AuthenticatedRequest
>(
  async (req) => {
    const id = req.user.id;

    const result = await Database.query(
      `SELECT id, email, name, created_at 
       FROM users 
       WHERE id = $1`,
      [id],
    );

    if (!result[0]) {
      throw new Error("Usuario no encontrado");
    }

    return { user: result[0] };
  },
  { errorName: "No se pudo recuperar el usuario autorizado" },
);
