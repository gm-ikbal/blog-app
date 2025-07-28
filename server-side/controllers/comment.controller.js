import Comment from '../models/Comments.js';
import { errorHandler } from '../Utils/error.js';


export const createComment = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        if (!content || !postId) {
            return next(
                errorHandler(400, 'Content and postId are required')
            );
        }
        const newComment = new Comment({
            content,
            postId,
            userId: req.user.id,
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        if (!comment.likes.includes(req.user.id)) {
            await Comment.findByIdAndUpdate(req.params.commentId, {
                $push: { likes: req.user.id },
                $inc: { numberOfLikes: 1 }
            });
            res.status(200).json({ message: 'Comment liked successfully' });
        } else {
            res.status(400).json({ message: 'Comment already liked' });
        }
    } catch (error) {
        next(error);
    }
};

export const unlikeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        if (comment.likes.includes(req.user.id)) {
            await Comment.findByIdAndUpdate(req.params.commentId, {
                $pull: { likes: req.user.id },
                $inc: { numberOfLikes: -1 }
            });
            res.status(200).json({ message: 'Comment unliked successfully' });
        } else {
            res.status(400).json({ message: 'Comment not liked' });
        }
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        // Check if user is the comment owner or admin
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You can only edit your own comments'));
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { content: req.body.content },
            { new: true }
        );

        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        // Check if user is the comment owner or admin
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You can only delete your own comments'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getcomments = async (req, res, next) => {
    // if (!req.user.isAdmin)
    //   return next(errorHandler(403, 'You are not allowed to get all comments'));
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
        next(error);
    }
};

