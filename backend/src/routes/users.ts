import { Router } from "express";
import {
  createUsers,
  deleteUser,
  readUsers,
  updateUser,
} from "../handlers/users";

const userRouter: Router = Router();

userRouter.get("/read", readUsers);
userRouter.post("/create", createUsers);
userRouter.patch("/update", updateUser);
userRouter.delete("/delete", deleteUser);

export default userRouter;
