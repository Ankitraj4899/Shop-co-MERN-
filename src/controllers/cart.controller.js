import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
export async function getCartController(req, res) {
    try {
        const result = await cartModel.findOne({ user: req.user.id });
        if (!result) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
        return res.status(200).json({
            message: "cart fetched successfully",
            result
        })
    } catch (error) {
        return res.status(500).json({
            message: "cart not found",
            error: error.message
        })
    }
}

export async function clearCartController(req, res) {
    try {
        const deleted = await cartModel.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } }, { new: true });
        if (!deleted) {
            return res.status(404).json({
                message: "cart not found"
            })
        }
        return res.status(200).json({
            message: "cart deleted successfully",
            deleted
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}


export async function updateCartController(req, res) {
    try {
        const { id } = req.params;
        const qty = Number(req.body.quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }
        const cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
        const item = cart.items.find(
            item => item.product.toString() === id
        );
        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if (product.status !== "active") {
            return res.status(400).json({
                message: "Product is not available"
            });
        }
        if (qty > product.quantity) {
            return res.status(400).json({
                message: `Only ${product.quantity} units are available`
            });
        }
        item.quantity = qty;
        await cart.save();
        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}


export async function removeFromCartController(req, res) {
    try {
        const { id } = req.params;
        const cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                message: "cart not found"
            })
        }
        const itemExists = cart.items.some(
            item => item.product.toString() === id
        );
        if (!itemExists) {
            return res.status(404).json({
                message: "product not found in cart"
            });
        }
        cart.items = cart.items.filter(
            item => item.product.toString() !== id
        );
        await cart.save();
        return res.status(200).json({
            message: "item deleted successfully",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

export async function addToCartController(req, res) {
    try {
        const { items } = req.body;
        const cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                message: "Not found",
            })
        }
        const cartItems = [];
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
            cartItems.push({
                product: product._id,
                quantity: item.quantity
            });
        }
        cart.items.push(...cartItems);
        await cart.save();
        return res.status(200).json({
            message: "Products added to cart successfully",
            cart
        });
 
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}