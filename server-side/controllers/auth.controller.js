import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import { errorHandler } from '../Utils/error.js';
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const register = async(req, res, next) => {
    try {
        // Accept both 'name' and 'username' from the frontend
        const name = req.body.name || req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        // Input validation FIRST!
        if (!name || !email || !password) {
            return next(errorHandler(400, "All fields are required"));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }
        const user = await User.create({ name, email, password: hashedPassword });
        res.json({ message: "User created successfully", user });
    } catch (error) {
        next(errorHandler(500, "Something went Wrong!"))
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required!"));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid pasword!"));
        }
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie("access_token", token, {
                httpOnly: true,
            })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

