import { RequestHandler } from "express";
import Database from "@/database/init";
import { AuthenticatedRequest } from "@/middleware/auth";
import { User } from "@/types";
import HandlerFactory from "@/utils/handler";

export const updateUser: RequestHandler = HandlerFactory.create<
  { user: User },
  AuthenticatedRequest
>(
  async (req, _res) => {
    const id = req.user?.id;
    const name = req.body?.name;
    const email = req.body?.email;

    if (!id) {
      throw new Error("No id provided");
    }

    const result = await Database.query<User>(
      `UPDATE users
     SET 
      email = COALESCE($1, email), 
      name = COALESCE($2, name)
     WHERE id = $3
     RETURNING id, email, name`,
      [email, name, id],
    );

    const user = result[0];
    if (!user) {
      throw new Error("User not found or update failed");
    }

    return { user };
  },
  { errorName: "Failed to update user" },
);
