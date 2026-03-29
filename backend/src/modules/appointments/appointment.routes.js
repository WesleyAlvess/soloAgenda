import { Router } from "express";
import { createAppointmentController, getAppointmentsController, updateAppointmentStatusController } from "./appointment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createAppointmentController);
router.get("/", authMiddleware, getAppointmentsController);
router.patch("/:id/status", authMiddleware, updateAppointmentStatusController);

export default router;
