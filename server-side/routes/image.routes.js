import express from 'express';
import { uploadImage, upload } from '../controllers/image.controller.js';
import verifyUser from '../Utils/verify.js';
import User from '../models/user.model.js';

const router = express.Router();

// Route for uploading profile images
router.post('/upload', verifyUser, upload.single('image'), uploadImage);

// Route to get user's profile image
router.get('/profile/:userId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profileImage || !user.profileImage.data) {
            return res.status(404).json({ message: 'Profile image not found' });
        }

        res.set('Content-Type', user.profileImage.contentType);
        res.send(user.profileImage.data);
    } catch (error) {
        next(error);
    }
});

// Route to check if user has profile image
router.get('/has-profile-image/:userId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hasImage = !!(user.profileImage && user.profileImage.data);
        res.json({ hasImage });
    } catch (error) {
        next(error);
    }
});

// Debug route to test if the router is working
router.get('/test', (req, res) => {
    console.log('Image route test endpoint hit');
    res.json({ message: 'Image route is working' });
});

export default router; 