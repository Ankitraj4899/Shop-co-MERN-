import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 // 7 days in seconds (MongoDB TTL auto-removal)
    }
});

const blacklistModel = mongoose.model("Blacklist", blacklistSchema);

export default blacklistModel;
