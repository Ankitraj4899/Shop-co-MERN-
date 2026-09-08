import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import cartModel from "../models/cart.model.js";

// Register a new user
export async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;
        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "username or email already registered",
            })
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            username, email, password: hashedPassword
        })
        await cartModel.create({ user: user._id, items: [] });
        const refreshToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: "7d",
        })
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: "15m",
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            //means client side js can not access the data stored in cookie
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        res.status(201).json({
            message: "user registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone || "",
                address: user.address || ""
            },
            token: accessToken
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Login an existing user
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }


        const refreshToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: "7d",
        })

        const accessToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: "15m",
        })


        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });


        res.cookie("refreshToken", refreshToken, {
            //means client side js can not access the data stored in cookie. only the server can receive and process it during HTTP requests.
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone || "",
                address: user.address || "",
            },
            token: accessToken
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Get the logged in user
export async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                message: "user not found",
            })
        }

        res.status(200).json({
            message: "user fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone || "",
                address: user.address || ""
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export async function updateProfileController(req, res) {
    try {
        const { username, phone, address } = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { username, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone || "",
                address: user.address || "",
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


// Generating a new Refreshing token
export async function refreshTokenController(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        const accessToken = jwt.sign({
            id: decoded.id,
            role: decoded.role
        }, config.JWT_SECRET, {
            expiresIn: "15m",
        })


        const newRefreshToken = jwt.sign({
            id: decoded.id,
            role: decoded.role
        }, config.JWT_SECRET, {
            expiresIn: "7d",
        })
        //Storing the new refresh token in the cookie to add an extra layer of security
        res.cookie("refreshToken", newRefreshToken, {
            //means client side js can not access the data stored in cookie
            httpOnly: true,
            // browser will send the cookie only over HTTPS.
            secure: false,
            // sameSite controls whether the browser sends your cookie when the request comes from another website.     
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: "access token refreshed successfully",
            token: accessToken
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Logout the existing user
export async function logoutController(req, res) {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "user logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}
