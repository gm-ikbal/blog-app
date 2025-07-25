import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../Utils/error.js'
import Post from '../models/post.model.js'

export const userUpdate = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(
                errorHandler(400, 'Username must be between 7 and 20 characters')
            );
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(400, 'Username can only contain letters and numbers')
            );
        }
    }
    try {
        // Create update object with only provided fields
        const updateFields = {};
        if (req.body.username) {
            updateFields.username = req.body.username;
        }
        if (req.body.email) {
            updateFields.email = req.body.email;
        }
        if (req.body.profilePicture) {
            updateFields.profilePicture = req.body.profilePicture;
        }
        if (req.body.password) {
            updateFields.password = req.body.password;
        }

        // Only update if there are fields to update
        if (Object.keys(updateFields).length === 0) {
            return next(errorHandler(400, 'No fields to update'));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: updateFields,
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, profileImage, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const userDelete = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const userSignOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
}
