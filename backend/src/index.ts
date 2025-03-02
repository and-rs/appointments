import "dotenv/config";
import express, { Application, Request, Response } from "express";
import Database from "./database/init";
import doctorsRouter from "./routes/doctors";
import userRouter from "./routes/users";

const app: Application = express();

app.use(express.json());

app.get("/", async (_req, res) => {
  const result = await Database.query("SELECT version()");
  res.json({ test: result[0].version });
});

app.use("/users", userRouter);
app.use("/doctors", doctorsRouter);

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

if (process.env.NODE_ENV === "dev") {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`app is listening at http://localhost:${PORT}`);
  });
}

export default app;
