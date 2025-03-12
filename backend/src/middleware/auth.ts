import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import HandlerFactory from "@/utils/handler-factory";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

function isValidToken(decoded: any): decoded is AuthenticatedRequest["user"] {
  return typeof decoded?.id === "string" && typeof decoded?.email === "string";
}

export const authenticate: RequestHandler = HandlerFactory.create(
  async (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Autenticación requerida");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!isValidToken(decoded)) {
      throw new Error("Token inválido");
    }

    (req as AuthenticatedRequest).user = decoded;

    next();
  },
  { errorStatus: 401, errorName: "Autenticación fallida" },
);
