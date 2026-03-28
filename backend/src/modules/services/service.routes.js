import { Router } from "express"
import { createServiceController, deleteServiceController, updateServiceController } from "./service.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authMiddleware, createServiceController)
router.put("/:id", authMiddleware, updateServiceController)
router.delete("/:id", authMiddleware, deleteServiceController)

export default router
