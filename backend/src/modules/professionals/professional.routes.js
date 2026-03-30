import { Router } from "express";
import { updateWorkingHoursController } from "./professional.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.patch("/working-hours", authMiddleware, updateWorkingHoursController);

export default router;
