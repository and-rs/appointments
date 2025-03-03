import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import Database from "@/database/init";
import HandlerFactory from "@/utils/handler";
import { User } from "@/types";

export const createUsers: RequestHandler = HandlerFactory.create<{
  user: User;
}>(
  async (req, res) => {
    const { email, password, name } = req.body as User;

    if (!email || !password || !name) {
      res.status(400).json({
        error: "Email, password and name are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await Database.query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.length > 0) {
      res.status(409).json({
        error: "Email already registered",
      });
    }

    const result = await Database.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, hashedPassword, name],
    );

    const user = result[0];

    return { user };
  },
  { errorName: "Failed to create user", successStatus: 201 },
);
