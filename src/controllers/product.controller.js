import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
// uploading the file on cloudinary server with base64 fallback
function uploadToCloudinary(file) {
    return new Promise((resolve) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            return resolve(`data:${file.mimetype || "image/png"};base64,${file.buffer.toString("base64")}`);
        }
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "products"
            },
            (error, result) => {
                if (error) {
                    console.warn("Cloudinary upload failed, falling back to base64 data URI:", error.message);
                    resolve(`data:${file.mimetype || "image/png"};base64,${file.buffer.toString("base64")}`);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        stream.end(file.buffer);
    });
}

function parseGalleryImages(galleryImages) {
    if (!galleryImages) return [];
    if (Array.isArray(galleryImages)) return galleryImages;
    if (typeof galleryImages === "string") {
        try {
            const parsed = JSON.parse(galleryImages);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            return galleryImages.split(",").map((s) => s.trim()).filter(Boolean);
        }
    }
    return [];
}
// Get all products
export async function getProductsController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 12, 50);
        const startIndex = (page - 1) * limit;
        const { search, category, style, color, size, minPrice, maxPrice, availability, sort = "newest" } = req.query;
        const filter = { status: "active" };

        if (search?.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } }
            ];
        }

        if (category) {
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                filter.category = category;
            } else {
                const foundCategory = await categoryModel.findOne({ name: { $regex: `^${category}$`, $options: "i" } });
                if (foundCategory) {
                    filter.category = foundCategory._id;
                }
            }
        }

        if (style && style.toLowerCase() !== "all") {
            filter.style = { $regex: `^${style}$`, $options: "i" };
        }

        if (color) {
            filter["colors.name"] = { $regex: color, $options: "i" };
        }

        if (size) {
            filter["variants.size"] = { $regex: `^${size}$`, $options: "i" };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (availability === "out-of-stock") filter.quantity = 0;
        if (availability === "in-stock") filter.quantity = { $gt: 0 };

        const sortMap = {
            low: { price: 1 },
            high: { price: -1 },
            name: { name: 1 },
            oldest: { createdAt: 1 },
            newest: { createdAt: -1 },
            popular: { rating: -1, reviewsCount: -1 },
            rating: { rating: -1 }
        };

        const totalProducts = await productModel.countDocuments(filter);
        const products = await productModel.find(filter)
            .populate("category", "name")
            .sort(sortMap[sort] || sortMap.newest)
            .limit(limit)
            .skip(startIndex);

        const results = {
            results: products,
            products,
            page,
            limit,
            total: totalProducts,
            totalPages: Math.ceil(totalProducts / limit) || 1,
            hasNext: page < Math.ceil(totalProducts / limit),
            hasPrevious: page > 1,
        };

        return res.status(200).json({
            message: "products fetched successfully",
            results,
            products,
            total: totalProducts,
            totalPages: Math.ceil(totalProducts / limit) || 1,
            page,
            limit
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export async function getAdminProductsController(req, res) {
    try {
        const products = await productModel.find().populate("category", "name").sort({ createdAt: -1 });
        return res.status(200).json({ message: "admin products fetched successfully", products });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Get Single product
export async function getProductController(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).populate("category", "name");
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
        const { name, description, price, originalPrice, discount, rating, style, colors, category, quantity, variants, status } = req.body;

        const isCategory = await categoryModel.findById(category);

        if (!isCategory) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        const parsedVariants = typeof variants === "string" ? JSON.parse(variants) : (variants || []);
        const parsedColors = typeof colors === "string" ? JSON.parse(colors) : (colors || []);

        const thumbnailImage = req.files?.thumbnailImage?.[0];
        const galleryImages = req.files?.galleryImages || [];

        if (!thumbnailImage && !req.body.thumbnailImage) {
            return res.status(400).json({
                message: "Thumbnail image is required",
            });
        }

        const thumbnailUrl = thumbnailImage ? await uploadToCloudinary(thumbnailImage) : req.body.thumbnailImage;

        const uploadedGalleryUrls = galleryImages.length > 0
            ? await Promise.all(galleryImages.map((file) => uploadToCloudinary(file)))
            : [];
        const existingGalleryUrls = parseGalleryImages(req.body.galleryImages);
        const galleryUrls = [...uploadedGalleryUrls, ...existingGalleryUrls];

        const product = await productModel.create({
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            discount: discount ? Number(discount) : 0,
            rating: rating ? Number(rating) : 4.5,
            style: style || "Casual",
            colors: parsedColors,
            thumbnailImage: thumbnailUrl,
            galleryImages: galleryUrls,
            category,
            quantity: Number(quantity),
            variants: parsedVariants,
            status: status || "active"
        });

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

// Update a product
export async function updateProductController(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, originalPrice, discount, rating, style, colors, category, quantity, variants, status } = req.body;

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

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
        if (discount !== undefined) updateData.discount = Number(discount);
        if (rating !== undefined) updateData.rating = Number(rating);
        if (style !== undefined) updateData.style = style;
        if (category !== undefined) updateData.category = category;
        if (status !== undefined) updateData.status = status;
        if (quantity !== undefined) updateData.quantity = Number(quantity);
        if (colors !== undefined) {
            updateData.colors = typeof colors === "string" ? JSON.parse(colors) : colors;
        }
        if (variants !== undefined) {
            updateData.variants = typeof variants === "string" ? JSON.parse(variants) : variants;
        }

        const thumbnailImage = req.files?.thumbnailImage?.[0];
        const galleryImages = req.files?.galleryImages || [];

        if (thumbnailImage) {
            updateData.thumbnailImage = await uploadToCloudinary(thumbnailImage);
        } else if (req.body.thumbnailImage !== undefined) {
            updateData.thumbnailImage = req.body.thumbnailImage;
        }

        if (galleryImages.length > 0) {
            const uploadedUrls = await Promise.all(
                galleryImages.map((file) => uploadToCloudinary(file))
            );
            const existingUrls = req.body.galleryImages !== undefined ? parseGalleryImages(req.body.galleryImages) : [];
            updateData.galleryImages = [...uploadedUrls, ...existingUrls];
        } else if (req.body.galleryImages !== undefined) {
            updateData.galleryImages = parseGalleryImages(req.body.galleryImages);
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
            });
        }
        return res.status(200).json({
            message: "product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Add a review to a product
export async function createProductReviewController(req, res) {
    try {
        const { id } = req.params;
        const { rating, comment, name } = req.body;

        if (!rating || !comment?.trim()) {
            return res.status(400).json({
                message: "Rating and review comment are required"
            });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const newReview = {
            user: req.user?.id,
            name: name?.trim() || req.user?.username || "Verified Customer",
            rating: Math.min(5, Math.max(1, Number(rating))),
            comment: comment.trim(),
            verified: true,
            createdAt: new Date()
        };

        if (!product.reviews) {
            product.reviews = [];
        }

        product.reviews.unshift(newReview);
        product.reviewsCount = product.reviews.length;
        const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
        product.rating = Number((totalRating / product.reviews.length).toFixed(1));

        await product.save();

        return res.status(201).json({
            message: "Review added successfully",
            review: newReview,
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}
