import multer from 'multer';
import { errorHandler } from '../Utils/error.js';
import User from '../models/user.model.js';

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

        // Save image to database
        const imageBuffer = req.file.buffer;
        const contentType = req.file.mimetype;

        // Update user's profile image in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                profileImage: {
                    data: imageBuffer,
                    contentType: contentType
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        console.log('Image saved to database successfully, size:', imageBuffer.length);

        res.status(200).json({
            success: true,
            message: 'Image uploaded and saved to database successfully',
            userId: updatedUser._id
        });
    } catch (error) {
        console.error('Error in uploadImage:', error);
        next(error);
    }
};

export { upload }; 