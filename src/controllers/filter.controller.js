import productModel from "../models/product.model.js";
// Sorting low to high based on price
export async function lowToHigh(req, res) {
    try {
        const allProducts = await productModel.find({ status: "active" }).sort({ price: 1 });
        if (allProducts.length === 0) {
            return res.status(404).json({
                message: "Products not found"
            });
        }
        return res.status(200).json({
            message: "Products sorted successfully",
            products: allProducts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        })
    }
}

// Sorting high to low based on price
export async function highToLow(req, res) {
    try {
        const allProducts = await productModel.find({ status: "active" }).sort({ price: -1 });
        if (allProducts.length === 0) {
            return res.status(404).json({
                message: "Products not found"
            });
        }
        return res.status(200).json({
            message: "Products sorted successfully",
            products: allProducts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        })
    }
}

// Searching a Product
export async function search(req, res) {
    try {
        const { key } = req.body;
        if (!key || !key.trim()) {
            return res.status(400).json({
                message: "Search key is required"
            });
        }
        const products = await productModel.find({
            status: "active"
        });
        const result = products.filter(product =>
            product.name.toLowerCase().includes(key.toLowerCase().trim())
        );
        if (result.length === 0) {
            return res.status(404).json({
                message: `${key} not found`
            });
        }
        return res.status(200).json({
            message: "product found successfully",
            result,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        })
    }
}

// Filtering a product based on size
export async function filterSize(req, res) {
    try {
        const { size } = req.body;
        const products = await productModel.find({ "variants.size": size, status: "active" });
        if (products.length === 0) {
            return res.status(404).json({
                message: `product of ${size} not available`,
            })
        }
        return res.status(200).json({
            message: "products found",
            products
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

// Sort the products nased on new to old
export async function newest(req, res) {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });
        if (products.length === 0) {
            return res.status(404).json({
                message: "Not available",
            })
        }
        return res.status(200).json({
            message: "Newest product fetched",
            products,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        })
    }
}

// Sort the products based on lod to new
export async function oldest(req, res) {
    try {
        const products = await productModel.find().sort({ createdAt: 1 });
        if (products.length === 0) {
            return res.status(404).json({
                message: "Not available",
            })
        }
        return res.status(200).json({
            message: "Oldest product fetched",
            products,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        })
    }
}