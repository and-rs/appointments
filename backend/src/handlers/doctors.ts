import { Request, Response } from "express";
import Database from "@/database/init";

export default async function getDoctors(_req: Request, res: Response) {
  try {
    const result = await Database.query("select * from doctors;");
    res.json(result);
  } catch (error) {
    const { message } = error as Error;
    res.json(message);
  }
}
