import { Router } from "express"
import authRoutes from "../modules/auth/auth.routes.js"
import serviceRoutes from "../modules/services/service.routes.js"
import appointmentRoutes from "../modules/appointments/appointment.routes.js";
import professionalRoutes from "../modules/professionals/professional.routes.js";

const router = Router()

router.use("/auth", authRoutes)
router.use("/services", serviceRoutes)
router.use("/appointments", appointmentRoutes);
router.use("/professionals", professionalRoutes);

export default router
