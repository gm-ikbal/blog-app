import Post from '../models/post.model.js'
import { errorHandler } from '../Utils/error.js'

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '')
        + '-' + Date.now();
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        console.log('Saved post:', savedPost);
        console.log('Post slug:', savedPost.slug);
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: savedPost
        });
    } catch (error) {
        console.error('Error saving post:', error);
        next(error);
    }
}