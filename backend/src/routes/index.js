import { Router } from "express"
import authRoutes from "../modules/auth/auth.routes.js"
import serviceRoutes from "../modules/services/service.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/services", serviceRoutes)

export default router
