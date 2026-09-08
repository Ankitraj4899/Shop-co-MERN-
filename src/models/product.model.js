import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    originalPrice: {
        type: Number,
        min: 0,
        default: null,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.5,
    },
    reviewsCount: {
        type: Number,
        min: 0,
        default: 0,
    },
    thumbnailImage: {
        type: String,
        required: true,
    },
    galleryImages: {
        type: [String],
        default: [],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    style: {
        type: String,
        enum: ["Casual", "Formal", "Party", "Gym"],
        default: "Casual",
    },
    colors: [
        {
            name: { type: String, trim: true },
            hex: { type: String, trim: true },
        },
    ],
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    variants: [
        {
            size: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
        },
    ],
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                required: true,
            },
            verified: {
                type: Boolean,
                default: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
},
{ 
    timestamps: true
});

productSchema.index({ category: 1, style: 1, price: 1, quantity: 1, status: 1 });
productSchema.index({ name: "text", description: "text" });

const productModel = mongoose.model("Product", productSchema);

export default productModel;