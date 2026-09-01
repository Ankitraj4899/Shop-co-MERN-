import { Router } from "express";
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const categoryRouter = Router();


// Get all categories
categoryRouter.get("/", getCategories);

// Get single category
categoryRouter.get("/:id", getCategory);

// Create category
categoryRouter.post("/", authMiddleware, adminMiddleware, createCategory);

// Update category
categoryRouter.put("/:id", authMiddleware, adminMiddleware, updateCategory);

// Delete category
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);


export default categoryRouter;