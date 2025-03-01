import "dotenv/config";
import express, { Application, Request, Response } from "express";
import userRouter from "./routes/users";

const app: Application = express();

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);

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
