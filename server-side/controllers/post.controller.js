import Post from '../models/post.model.js'
import { errorHandler } from '../Utils/error.js'

export const createPost = async (req, res, next) => {
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
        console.log('Post image length:', savedPost.image ? savedPost.image.length : 'No image');
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


export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        next(error);
    }
};


export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        // Allow post creator or admin to delete the post
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this post'));
        }
        await Post.findByIdAndDelete(req.params.postid);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        // Allow post creator or admin to update the post
        if (post.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to update this post'));
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postid,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        next(error);
    }
}

export const getPostBySlug = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        
        res.status(200).json({
            success: true,
            post: post
        });
    } catch (error) {
        next(error);
    }
}
export const getRecentPosts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const posts = await Post.find().sort({ createdAt: -1 }).limit(limit);
        res.status(200).json({ success: true, posts: posts });
    } catch (error) {
        next(error);
    }
}

export const searchPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        
        const posts = await Post.find({
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        next(error);
    }
}
