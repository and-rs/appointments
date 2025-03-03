import { RequestHandler } from "express";
import Database from "@/database/init";
import { User } from "@/types";
import HandlerFactory from "@/utils/handler";

export const readUsers: RequestHandler = HandlerFactory.create<{
  users: User[];
}>(
  async () => {
    const users = await Database.query<User>("SELECT * FROM users");
    return { users };
  },
  { errorName: "Failed to fetch users" },
);
