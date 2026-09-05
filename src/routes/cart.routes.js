import { Router } from "express";
import {getCartController,addToCartController,updateCartController,removeFromCartController,clearCartController} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.get("/", authMiddleware, getCartController);

cartRouter.post("/", authMiddleware, addToCartController);

cartRouter.put("/:productId", authMiddleware, updateCartController);

cartRouter.delete("/:productId", authMiddleware, removeFromCartController);

cartRouter.delete("/", authMiddleware, clearCartController);

export default cartRouter;