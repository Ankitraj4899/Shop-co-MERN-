import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";

export async function getAllOrdersController(req, res) {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
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
        results.results = await orderModel.find().limit(limit).skip(startIndex);
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


export async function createOrderController(req, res) {
    try {
        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "order items are required"
            });
        }
        if (!shippingAddress) {
            return res.status(400).json({
                message: "shipping address is required"
            });
        }
        const orderItems = [];
        let subtotal = 0;
        for (const item of items) {
            if (!item.product || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: "product and valid quantity are required"
                });
            }
            const product = await productModel.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: "product not found"
                });
            }
            if (product.status !== "active") {
                return res.status(400).json({
                    message: `${product.name} is not available`
                });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `not enough stock for ${product.name}`
                });
            }
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
            subtotal += product.price * item.quantity;
        }
        const discount = 0;
        const totalPrice = subtotal - discount;
        const order = await orderModel.create({
            user: req.user.id,
            items: orderItems,
            subtotal,
            discount,
            totalPrice,
            shippingAddress
        });
        for (const item of items) {
            await productModel.findByIdAndUpdate(item.product, {
                $inc: {
                    quantity: -item.quantity,
                }
            });
        }
        return res.status(201).json({
            message: "order created successfully",
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export async function getMyOrdersController(req, res) {
    try {
        const orders = await orderModel.find({
            user: req.user.id
        });

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

export async function getMyOrderController(req, res) {
    try {
        const { id } = req.params;

        const order = await orderModel.findOne({
            _id: id,
            user: req.user.id
        });

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
