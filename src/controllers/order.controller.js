import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
// Get all the orders
export async function getAllOrdersController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const totalOrders = await orderModel.countDocuments();
        if (endIndex < totalOrders) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        results.results = await orderModel.find().populate("user", "username email").populate("items.product", "name thumbnailImage").limit(limit).skip(startIndex);
        return res.status(200).json({
            message: "orders fetched successfully",
            results
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Create a new Order
export async function createOrderController(req, res) {
    try {
        const { items, shippingAddress, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required"
            });
        }
        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }
        const orderItems = [];
        let subtotal = 0;
        for (const item of items) {
            if (!item.product || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: "Invalid product or quantity"
                });
            }
            const product = await productModel.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            if (product.status !== "active") {
                return res.status(400).json({
                    message: `${product.name} is not available`
                });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Only ${product.quantity} units of ${product.name} are available`
                });
            }
            const itemSubtotal = product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size,
                thumbnailImage: product.thumbnailImage
            });
            subtotal += itemSubtotal;
        }
        const shippingFee = 15;
        const normalizedCoupon = couponCode?.trim().toLowerCase();
        const discountRate = normalizedCoupon === "save20" ? 0.2 : normalizedCoupon === "save10" ? 0.1 : 0;
        const discount = Number((subtotal * discountRate).toFixed(2));
        const totalPrice = subtotal - discount + shippingFee;
        for (const item of items) {
            const updatedProduct = await productModel.findOneAndUpdate(
                {
                    _id: item.product,
                    status: "active",
                    quantity: { $gte: item.quantity }
                },
                {
                    $inc: {
                        quantity: -item.quantity
                    }
                },
                {
                    new: true
                }
            );
            if (!updatedProduct) {
                return res.status(400).json({
                    message: "Product is out of stock or not enough stock available"
                });
            }
        }
        const order = await orderModel.create({ user: req.user.id, items: orderItems, subtotal, discount, couponCode: discountRate ? normalizedCoupon : undefined, shippingFee, totalPrice, shippingAddress });
        await cartModel.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });
        return res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Get user All orders
export async function getMyOrdersController(req, res) {
    try {
        const orders = await orderModel.find({
            user: req.user.id
        }).populate("items.product", "thumbnailImage").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "orders fetched successfully",
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Get User Single Order
export async function getMyOrderController(req, res) {
    try {
        const { id } = req.params;

        const order = await orderModel.findOne({
            _id: id,
            user: req.user.id
        }).populate("items.product", "thumbnailImage");

        if (!order) {
            return res.status(404).json({
                message: "order not found"
            });
        }

        return res.status(200).json({
            message: "order fetched successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }

}

// Update the status of the order
export async function updateOrderStatusController(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await orderModel.findByIdAndUpdate(id, { status }, {
            new: true,
            runValidators: true
        }
        );
        if (!order) {
            return res.status(404).json({
                message: "order not found"
            });
        }
        return res.status(200).json({
            message: "order status updated successfully",
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}