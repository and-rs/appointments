import { Router } from "express";
import createUsers from "../handlers/users";

const userRouter: Router = Router();

userRouter.get("/", createUsers);

export default userRouter;
