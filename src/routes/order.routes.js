import { Router } from "express";
import { getAllOrdersController, getMyOrdersController, updateOrderStatusController, getMyOrderController, createOrderController } from "../controllers/order.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const orderRouter = Router();

orderRouter.get('/', authMiddleware, adminMiddleware, getAllOrdersController);
orderRouter.post("/", authMiddleware, createOrderController);
orderRouter.get('/myorders', authMiddleware, getMyOrdersController);

orderRouter.get('/myorders/:id', authMiddleware, getMyOrderController);

orderRouter.post('/:id/status', authMiddleware, adminMiddleware, updateOrderStatusController);

export default orderRouter;