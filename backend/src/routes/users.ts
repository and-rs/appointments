import { Router } from "express";
import { createUsers, readUsers } from "../handlers/users";

const userRouter: Router = Router();

userRouter.get("/read", readUsers);
userRouter.post("/create", createUsers);

export default userRouter;
