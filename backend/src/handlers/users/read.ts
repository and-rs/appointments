import { RequestHandler } from "express";
import Database from "@/database/init";
import { User } from "@/types";
import HandlerFactory from "@/utils/handler-factory";

export const readUsers: RequestHandler = HandlerFactory.create<{
  users: User[];
}>(
  async () => {
    const users = await Database.query<User>("SELECT * FROM users");
    return { users };
  },
  { errorName: "No se pudieron obtener los usuarios" },
);
