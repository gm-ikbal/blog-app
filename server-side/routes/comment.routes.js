import express from 'express';
import { createComment, getComments, likeComment, unlikeComment, editComment, deleteComment } from '../controllers/comment.controller.js';
import verifyUser from '../Utils/verify.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getcomments/:postId', getComments);
router.post('/like/:commentId', verifyUser, likeComment);
router.post('/unlike/:commentId', verifyUser, unlikeComment);
router.put('/edit/:commentId', verifyUser, editComment);
router.delete('/delete/:commentId', verifyUser, deleteComment);

export default router;