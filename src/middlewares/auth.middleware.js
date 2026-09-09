import jwt from "jsonwebtoken";
import config from "../config/config.js";
import blacklistModel from "../models/blacklist.model.js";

export async function authMiddleware(req, res, next) {
    let token = req.cookies?.accessToken;
    if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            message: "Please login first",
        });
    }
    try {
        const isBlacklisted = await blacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token has been revoked. Please login again.",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}