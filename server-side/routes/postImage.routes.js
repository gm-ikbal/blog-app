import express from 'express';
import { uploadPostImage, uploadPost } from '../controllers/postImage.controller.js';
import verifyUser from '../Utils/verify.js';

const router = express.Router();

// Route for uploading post images
router.post('/upload', verifyUser, uploadPost.single('image'), uploadPostImage);

export default router; 