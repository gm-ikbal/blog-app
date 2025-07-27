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
