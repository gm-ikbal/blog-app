import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { errorHandler } from '../Utils/error.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'post-images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = 'post-' + uniqueSuffix + ext;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
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
        if (!req.file) {
            return next(errorHandler(400, 'No image file provided'));
        }
        const imageUrl = `/uploads/post-images/${req.file.filename}`;
        res.status(200).json({
            success: true,
            imageUrl: imageUrl,
            message: 'Post image uploaded successfully'
        });
    } catch (error) {
        next(error);
    }
};

export { upload as uploadPost }; 