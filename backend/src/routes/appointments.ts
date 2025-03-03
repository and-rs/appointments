import { createAppointment } from "@/handlers/appointments/create";
import { deleteAppointment } from "@/handlers/appointments/delete";
import { readAppointments } from "@/handlers/appointments/read";
import { updateAppointment } from "@/handlers/appointments/update";
import { authenticate } from "@/middleware/auth";
import { Router } from "express";

const appointmentsRouter: Router = Router();

appointmentsRouter.get("/read", authenticate, readAppointments);
appointmentsRouter.post("/create", authenticate, createAppointment);
appointmentsRouter.delete("/delete/:id", authenticate, deleteAppointment);
appointmentsRouter.patch("/update/:id", authenticate, updateAppointment);

export default appointmentsRouter;
