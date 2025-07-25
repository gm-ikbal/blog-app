import express from 'express';
import { uploadImage, upload } from '../controllers/image.controller.js';
import verifyUser from '../Utils/verify.js';

const router = express.Router();

// Route for uploading profile images
router.post('/upload', verifyUser, upload.single('image'), uploadImage);

// Debug route to test if the router is working
router.get('/test', (req, res) => {
    console.log('Image route test endpoint hit');
    res.json({ message: 'Image route is working' });
});

export default router; 