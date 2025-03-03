import { Router } from "express";
import { createUsers } from "../handlers/users/create";
import { deleteUser } from "../handlers/users/delete";
import { login } from "../handlers/users/login";
import { readUsers } from "../handlers/users/read";
import { updateUser } from "../handlers/users/update";
import { authenticate } from "../middleware/auth";

const userRouter: Router = Router();

userRouter.get("/read", authenticate, readUsers);
userRouter.patch("/update", authenticate, updateUser);
userRouter.delete("/delete", authenticate, deleteUser);

userRouter.post("/login", login);
userRouter.post("/create", createUsers);

export default userRouter;
