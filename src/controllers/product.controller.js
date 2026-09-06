import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
// uploading the file on cloudinary server
function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "products"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        stream.end(file.buffer);
    });
}
// GEt all products
export async function getProductsController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const totalProducts = await productModel.countDocuments();
        if (endIndex < totalProducts) {
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
        results.results = await productModel.find().limit(limit).skip(startIndex);

        return res.status(200).json({
            message: "products fetched successfully",
            results
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Get Single product
export async function getProductController(req, res) {
    try {
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
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Create a new product
export async function createProductController(req, res) {
    try {
        const { name, description, price, category, quantity, variants, status } = req.body;

        const isCategory = await categoryModel.findById(category);

        if (!isCategory) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        const parsedVariants = variants ? JSON.parse(variants) : [];

        const thumbnailImage = req.files?.thumbnailImage?.[0];
        const galleryImages = req.files?.galleryImages || [];

        if (!thumbnailImage) {
            return res.status(400).json({
                message: "Thumbnail image is required",
            });
        }

        const thumbnailUrl = await uploadToCloudinary(thumbnailImage);

        const galleryUrls = await Promise.all(
            galleryImages.map((file) => uploadToCloudinary(file))
        );

        const product = await productModel.create({ name, description, price, thumbnailImage: thumbnailUrl, galleryImages: galleryUrls, category, quantity, variants: parsedVariants, status });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// export async function updateProductController(req, res) {
//     const { id } = req.params;
//     const { name, description, price, thumbnailImage, galleryImages, category, variants, quantity, status } = req.body;
//     const isCategory = await categoryModel.findById(category);

//     if (!isCategory) {
//         return res.status(404).json({
//             message: "Category not found",
//         });
//     }
//     const product = await productModel.findByIdAndUpdate(id, { name, description, price, thumbnailImage, galleryImages, category, variants, quantity, status }, {
//         // returns the updated data
//         new: true,
//         // apply schema validation while updation
//         runValidators: true
//     });
//     if (!product) {
//         return res.status(404).json({
//             message: "product not found",
//         });
//     }
//     return res.status(200).json({
//         message: "product updated successfully",
//         product,
//     });
// }


// Update a product
export async function updateProductController(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, category, quantity, variants, status } = req.body;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (category) {
            const isCategory = await categoryModel.findById(category);

            if (!isCategory) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
        }

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name
        };
        if (description !== undefined) {
            updateData.description = description;
        }
        if (price !== undefined) {
            updateData.price = price;
        }
        if (category !== undefined) {
            updateData.category = category;
        }
        if (status !== undefined) {
            updateData.status = status;
        }
        if (quantity !== undefined) {
            updateData.quantity = quantity;
        }
        if (variants !== undefined) {
            updateData.variants = JSON.parse(variants);
        }

        const thumbnailImage = req.files?.thumbnailImage?.[0];
        const galleryImages = req.files?.galleryImages || [];

        if (thumbnailImage) {
            updateData.thumbnailImage = await uploadToCloudinary(thumbnailImage);
        }

        if (galleryImages.length > 0) {
            updateData.galleryImages = await Promise.all(
                galleryImages.map(file => uploadToCloudinary(file))
            );
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Delete a product
export async function deleteProductController(req, res) {
    try {
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
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}
