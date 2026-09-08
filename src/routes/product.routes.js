import { Router } from "express";
import { 
    getProductsController, 
    getAdminProductsController, 
    getProductController, 
    createProductController, 
    updateProductController, 
    deleteProductController,
    createProductReviewController 
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { filterSize, highToLow, lowToHigh, newest, oldest, search } from "../controllers/filter.controller.js";

const productRouter = Router();

productRouter.get("/admin/all", authMiddleware, adminMiddleware, getAdminProductsController);

// Get all products
productRouter.get("/", getProductsController);

// Search a product
productRouter.get("/search", search);

// Sort in ascending order
productRouter.get("/ascending", lowToHigh);

// Sort in descending order
productRouter.get("/descending", highToLow);

// Filter on the basis of size
productRouter.get("/filtersize", filterSize);

// New to Old
productRouter.get("/newest", newest);

// Old to New
productRouter.get("/oldest", oldest);

// Get one product
productRouter.get("/:id", getProductController);

// Add review to product
productRouter.post("/:id/reviews", authMiddleware, createProductReviewController);

// Create new product
productRouter.post("/", authMiddleware, adminMiddleware, upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 }
]), createProductController);

// Update a product
productRouter.put("/:id", authMiddleware, adminMiddleware, upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 }
]), updateProductController);

// Delete a product
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);

export default productRouter;