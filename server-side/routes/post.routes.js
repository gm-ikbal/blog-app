import express from 'express'
import { createPost, getposts } from '../controllers/post.controller.js'
import verifyUser from '../Utils/verify.js'
const router = express.Router()

router.post('/createpost', verifyUser, createPost)
router.get('/getposts', verifyUser, getposts)

export default router