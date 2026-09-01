import { Router } from "express";
import { registerController, loginController, getMe, refreshTokenController, logoutController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const authRouter = Router();
// Register Api
authRouter.post("/register", registerController);

// Login Api
authRouter.post("/login", loginController);

// Get me Api
authRouter.get("/get-me", authMiddleware, getMe);

// Generating refresh token Api
authRouter.post("/refresh", refreshTokenController);
//Logout Api
authRouter.post("/logout", logoutController)

export default authRouter;