import { Router } from "express";
import { createAppointmentController, getAppointmentsController, updateAppointmentStatusController, getDailyAgendaController } from "./appointment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createAppointmentController);
router.get("/", authMiddleware, getAppointmentsController);
router.patch("/:id/status", authMiddleware, updateAppointmentStatusController);
router.get("/daily", authMiddleware, getDailyAgendaController);

export default router;
