import { Router } from "express";
import { updateWorkingHoursController, updatePublicProfileController } from "./professional.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.patch("/working-hours", authMiddleware, updateWorkingHoursController);

// Public
router.patch("/public-profile", authMiddleware, updatePublicProfileController);

export default router;
