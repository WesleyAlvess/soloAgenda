import { Router } from "express";
import { getPublicProfessional, getPublicServices } from "./public.controller.js";

const router = Router();

router.get("/public/:slug", getPublicProfessional);
router.get("/public/:slug/services", getPublicServices);

export default router;
