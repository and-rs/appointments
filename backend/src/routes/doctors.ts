import { Router } from "express";
import getDoctors from "../handlers/doctors";

const doctorsRouter: Router = Router();

doctorsRouter.get("/get", getDoctors);

export default doctorsRouter;
