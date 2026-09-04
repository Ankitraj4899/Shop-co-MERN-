import { Router } from "express";
import { getCategoriesController, getCategoryController, createCategoryController, updateCategoryController, deleteCategoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const categoryRouter = Router();


// Get all categories
categoryRouter.get("/", getCategoriesController);

// Get single category
categoryRouter.get("/:id", getCategoryController);

// Create category
categoryRouter.post("/", authMiddleware, adminMiddleware, createCategoryController);

// Update category
categoryRouter.put("/:id", authMiddleware, adminMiddleware, updateCategoryController);

// Delete category
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategoryController);


export default categoryRouter;