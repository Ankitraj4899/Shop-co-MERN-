import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { getAdminDashboardController } from "../controllers/admin.controller.js";

const adminRouter = Router();
adminRouter.use(authMiddleware, adminMiddleware);
adminRouter.get("/dashboard", getAdminDashboardController);

export default adminRouter;