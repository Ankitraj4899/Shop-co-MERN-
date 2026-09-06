import categoryModel from "../models/category.model.js";
// Get all categories
export async function getCategoriesController(req, res) {
    try {
        const categories = await categoryModel.find();
        return res.status(200).json({
            message: "categories fetched successfully",
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}
// Get a single category

export async function getCategoryController(req, res) {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                message: "category not found",
            });
        }
        return res.status(200).json({
            message: "category fetched successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Create a new category
export async function createCategoryController(req, res) {
    try {
        const { name, description } = req.body;
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({
                message: "category already exists",
            });
        }
        const category = await categoryModel.create({ name, description });
        return res.status(201).json({
            message: "category created successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Update a category
export async function updateCategoryController(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await categoryModel.findByIdAndUpdate(id, { name, description, }, {
            new: true,
            runValidators: true,
        }
        );
        if (!category) {
            return res.status(404).json({
                message: "category not found",
            });
        }
        return res.status(200).json({
            message: "category updated successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Delete a category
export async function deleteCategoryController(req, res) {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                message: "category not found",
            });
        }
        return res.status(200).json({
            message: "category deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}
