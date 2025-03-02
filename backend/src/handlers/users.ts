import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import Database from "../database/init";
import { User } from "../types";
import HandlerFactory from "../utils/handler";

export const createUsers: RequestHandler = HandlerFactory.create<{
  user: User;
}>(
  async (req: Request, res: Response) => {
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
  "Failed to create user",
  201,
);

export const readUsers: RequestHandler = HandlerFactory.create<{
  users: User[];
}>(async () => {
  const users = await Database.query<User>("SELECT * FROM users");
  return { users };
}, "Failed to fetch users");
