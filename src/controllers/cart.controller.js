import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
// Get cart
export async function getCartController(req, res) {
    try {
        let result = await cartModel.findOne({ user: req.user.id }).populate("items.product");
        if (!result) {
            result = await cartModel.create({ user: req.user.id, items: [] });
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

// Clear the cart
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
            cart: deleted,
            deleted
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

// Update the cart
export async function updateCartController(req, res) {
    try {
        const id = req.params.productId || req.params.id;
        const qty = Number(req.body.quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }
        let cart = await cartModel.findOne({ user: req.user.id });
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
        cart = await cartModel.findById(cart._id).populate("items.product");
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

// Remove item from the cart
export async function removeFromCartController(req, res) {
    try {
        const id = req.params.productId || req.params.id;
        let cart = await cartModel.findOne({ user: req.user.id });
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
        cart = await cartModel.findById(cart._id).populate("items.product");
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

// Add to the cart
export async function addToCartController(req, res) {
    try {
        const { items } = req.body;
        let cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            cart = await cartModel.create({ user: req.user.id, items: [] });
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
            const existingItem = cart.items.find((cartItem) => cartItem.product.toString() === product._id.toString() && cartItem.size === item.size);
            if (existingItem) {
                existingItem.quantity += item.quantity;
                if (existingItem.quantity > product.quantity) {
                    return res.status(400).json({ message: `Only ${product.quantity} units of ${product.name} are available` });
                }
            } else {
                cartItems.push({ product: product._id, quantity: item.quantity, size: item.size });
            }
        }
        cart.items.push(...cartItems);
        await cart.save();
        await cart.populate("items.product");
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