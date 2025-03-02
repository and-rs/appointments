import { Router } from "express";
import createUser from "../handlers/users";

const userRouter: Router = Router();

userRouter.get("/post", createUser);

export default userRouter;
