import categoryModel from "../models/category.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

export async function getAdminDashboardController(req, res) {
    try {
        const [products, categories, users, orders, outOfStock, lowStock] = await Promise.all([
            productModel.countDocuments(),
            categoryModel.countDocuments(),
            userModel.countDocuments(),
            orderModel.countDocuments(),
            productModel.countDocuments({ quantity: 0 }),
            productModel.countDocuments({ quantity: { $gt: 0, $lte: 5 } }),
        ]);
        return res.status(200).json({ stats: { products, categories, users, orders, outOfStock, lowStock } });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}