import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "@/types";
import Database from "@/database/init";
import HandlerFactory from "@/utils/handler-class";

export const login: RequestHandler = HandlerFactory.create<{ token: string }>(
  async (req) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Se requieren correo electrónico y contraseña");
    }

    const result = await Database.query<User & { password: string }>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const user = result[0];
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "48h" },
    );

    return { token };
  },
  { errorName: "Inicio de sesión fallido" },
);
