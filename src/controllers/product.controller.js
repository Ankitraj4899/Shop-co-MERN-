import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";

export async function getProductsController(req, res) {
    const products = await productModel.find();
    return res.status(200).json({
        message: "products fetched successfully",
        products
    })
}

export async function getProductController(req, res) {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
        return res.status(404).json({
            message: "product not found"
        })
    }
    return res.status(200).json({
        message: "product fetched successfully",
        product
    })
}

export async function createProductController(req, res) {
    const { name, description, price, images, category, quantity, status } = req.body;

    const isCategory = await categoryModel.findById(category);

    if (!isCategory) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    const product = await productModel.create({ name, description, price, images, category, quantity, status });

    return res.status(201).json({
        message: "Product created successfully",
        product
    });
}

export async function updateProductController(req, res) {
    const { id } = req.params;
    const { name, description, price, images, category, quantity, status } = req.body;
    const isCategory = await categoryModel.findById(category);

    if (!isCategory) {
        return res.status(404).json({
            message: "Category not found",
        });
    }
    const product = await productModel.findByIdAndUpdate(id, { name, description, price, images, category, quantity, status }, {
        // returns the updated data
        new: true,
        // apply schema validation while updation
        runValidators: true
    });
    if (!product) {
        return res.status(404).json({
            message: "product not found",
        });
    }
    return res.status(200).json({
        message: "product updated successfully",
        product,
    });
}

export async function deleteProductController(req, res) {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({
            message: "product not found",
        })
    }
    return res.status(200).json({
        message: "product deleted successfully",
    })
}