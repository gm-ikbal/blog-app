import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import { errorHandler } from '../Utils/error.js';
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const register = async (req, res, next) => {
  try {
    const name = req.body.name || req.body.username;
    const username = req.body.username || name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }
    const user = await User.create({ name, username, email, password: hashedPassword });
    res.json({ message: "User created successfully", user });
  } catch (error) {
    next(errorHandler(500, "Something went Wrong!"))
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required!"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password!"));
    }
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: pass, profileImage, ...rest } = validUser._doc;
    res.status(200).cookie("access_token", token, {
      httpOnly: true,
    })
      .json(rest);
  } catch (error) {
    return next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, profileImage, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        name,
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, profileImage, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

