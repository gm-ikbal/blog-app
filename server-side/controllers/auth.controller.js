import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        const user = await User.create({ name, email, password: hashedPassword });
        res.json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

export {register}