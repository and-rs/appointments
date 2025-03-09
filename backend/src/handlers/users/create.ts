import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import Database from "@/database/init";
import HandlerFactory from "@/utils/handler-class";
import { User } from "@/types";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const createUsers: RequestHandler = HandlerFactory.create<AuthResponse>(
  async (req) => {
    const { email, password, name } = req.body as User;

    if (!email || !password || !name) {
      throw new Error("Se requieren correo electrónico, contraseña y nombre.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await Database.query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.length > 0) {
      throw new Error("Email ya registrado");
    }

    const result = await Database.query<User>(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, hashedPassword, name],
    );

    const user = result[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },
  { errorName: "No se pudo crear el usuario", successStatus: 201 },
);
