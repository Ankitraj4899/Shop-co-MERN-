import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


export async function registerController(req,res) {
    const {username,email,password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[{username},{email}]
    })

    if (isAlreadyRegistered){
        res.status(409).json({
            message:"username or email already registered",
        })
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await userModel.create({
        username,email,password:hashedPassword
    })


    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"1d",
    })

    res.status(201).json({
        message:"user registered successfully",
        user:{
            username:user.username,
            email:user.email,
        },token
    })
}