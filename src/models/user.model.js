import mongoose from "mongoose";
import validator from 'validator';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"],
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
});

const userModel = mongoose.model("User", userSchema);
export default userModel;