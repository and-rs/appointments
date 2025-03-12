import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import HandlerFactory from "@/utils/handler-factory";
import { RequestHandler } from "express";

export const deleteUser: RequestHandler = HandlerFactory.create<
  { message: string },
  AuthenticatedRequest
>(
  async (req, _res) => {
    const id = req.user?.id;

    if (!id) {
      throw new Error("No se proporcionó ID de usuario");
    }

    const result = await Database.query(
      `DELETE FROM users 
     WHERE id = $1 
     RETURNING id`,
      [id],
    );

    if (!result[0]) {
      throw new Error("Usuario no encontrado");
    }

    return { message: "Usuario eliminado correctamente" };
  },
  { errorName: "No se pudo eliminar el usuario" },
);
