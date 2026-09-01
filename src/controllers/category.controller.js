import categoryModel from "../models/category.model.js";
export async function getCategories(req, res) {
    const categories = await categoryModel.find();
    return res.status(200).json({
        message: "categories fetched successfully",
        categories,
    });
}

export async function getCategory(req, res) {
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
}

export async function createCategory(req, res) {
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
}


export async function updateCategory(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await categoryModel.findByIdAndUpdate(id,
        {
            name,
            description,
        },
        {
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
}


export async function deleteCategory(req, res) {
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
}