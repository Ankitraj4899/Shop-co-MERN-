import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
const authRouter = Router();
// Register Api
authRouter.post("/register",registerController);

export default authRouter;