import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    thumbnailImage: {
        type: String,
        required: true,
    },

    galleryImages: {
        type: [String],
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
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

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

const productModel = mongoose.model("Product", productSchema);

export default productModel;