import multer from 'multer';
import { errorHandler } from '../Utils/error.js';

// Configure multer for image upload
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

export const uploadImage = async (req, res, next) => {
    try {
        console.log('Upload request received:', req.file);
        
        if (!req.file) {
            console.log('No file in request');
            return next(errorHandler(400, 'No image file provided'));
        }

        // Convert the image buffer to base64
        const imageBuffer = req.file.buffer;
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        console.log('Image processed successfully, size:', imageBuffer.length);

        res.status(200).json({
            success: true,
            imageUrl: base64Image,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Error in uploadImage:', error);
        next(error);
    }
};

export { upload }; 