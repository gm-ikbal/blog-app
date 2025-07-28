import multer from 'multer';
import { errorHandler } from '../Utils/error.js';
import User from '../models/user.model.js';

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
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
        if (!req.file) {
            return next(errorHandler(400, 'No image file provided'));
        }   
        const imageBuffer = req.file.buffer;
        const contentType = req.file.mimetype;
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
        res.status(200).json({
            success: true,
            message: 'Image uploaded and saved to database successfully',
            userId: updatedUser._id
        });
    } catch (error) {
        next(error);
    }
};

export { upload }; 