import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import HandlerFactory from "@/utils/handler";
import { RequestHandler } from "express";

export const deleteUser: RequestHandler = HandlerFactory.create<
  { message: string },
  AuthenticatedRequest
>(
  async (req, _res) => {
    const id = req.user?.id;

    if (!id) {
      throw new Error("No id provided");
    }

    const result = await Database.query(
      `DELETE FROM users 
     WHERE id = $1 
     RETURNING id`,
      [id],
    );

    if (!result[0]) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  },
  { errorName: "Failed to delete user" },
);
