import { Request, Response } from "express";

export default function createUsers(_req: Request, res: Response) {
  res.send("Hello from create user handler");
}
