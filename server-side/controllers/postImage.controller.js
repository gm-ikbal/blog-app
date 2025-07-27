import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { errorHandler } from '../Utils/error.js';

// Configure multer for file upload to filesystem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'post-images');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        console.log('Upload directory:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = 'post-' + uniqueSuffix + ext;
        
        console.log('Original filename:', file.originalname);
        console.log('Extracted extension:', ext);
        console.log('Generated filename:', filename);
        
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for post images
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

export const uploadPostImage = async (req, res, next) => {
    try {
        console.log('Post image upload request received:', req.file);
        
        if (!req.file) {
            console.log('No file in request');
            return next(errorHandler(400, 'No image file provided'));
        }

        // Generate the URL for the uploaded file
        const imageUrl = `/uploads/post-images/${req.file.filename}`;
        
        console.log('Post image saved successfully:', req.file.filename);
        console.log('Image URL:', imageUrl);

        res.status(200).json({
            success: true,
            imageUrl: imageUrl,
            message: 'Post image uploaded successfully'
        });
    } catch (error) {
        console.error('Error in uploadPostImage:', error);
        next(error);
    }
};

export { upload as uploadPost }; 