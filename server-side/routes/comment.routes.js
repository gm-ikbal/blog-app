import express from 'express';
import { createComment, getComments } from '../controllers/comment.controller.js';
import verifyUser from '../Utils/verify.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getcomments/:postId', getComments);

export default router;