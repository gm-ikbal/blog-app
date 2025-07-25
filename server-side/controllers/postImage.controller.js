import multer from 'multer';
import { errorHandler } from '../Utils/error.js';

// Configure multer for image upload
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for post images
    },
    fileFilter: (req, file, cb) => {
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

        // Convert the image buffer to base64 for post images
        const imageBuffer = req.file.buffer;
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        console.log('Post image processed successfully, size:', imageBuffer.length);

        res.status(200).json({
            success: true,
            imageUrl: base64Image,
            message: 'Post image uploaded successfully'
        });
    } catch (error) {
        console.error('Error in uploadPostImage:', error);
        next(error);
    }
};

export { upload as uploadPost }; 