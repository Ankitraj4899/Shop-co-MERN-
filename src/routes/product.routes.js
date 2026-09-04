import { Router } from "express";
import { getProductsController, getProductController, createProductController, updateProductController, deleteProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
const productRouter = Router();

// Get all products
productRouter.get("/", getProductsController);

// Get one product
productRouter.get("/:id", getProductController);

// Create new product
productRouter.post("/", authMiddleware, adminMiddleware, createProductController);

// Update a product
productRouter.put("/:id", authMiddleware, adminMiddleware, updateProductController);

// Delete a product
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);
export default productRouter;