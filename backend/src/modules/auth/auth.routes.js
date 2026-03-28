import { Router } from "express"
import { registerProfessional, loginProfessional } from "./auth.controller.js"

const router = Router()

router.post("/register", registerProfessional)
router.post("/login", loginProfessional)

export default router
