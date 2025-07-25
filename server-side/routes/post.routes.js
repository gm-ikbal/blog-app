import express from 'express'
import { createPost } from '../controllers/post.controller.js'
import verifyUser from '../Utils/verify.js'
const router = express.Router()

router.post('/createpost', verifyUser, createPost)

export default router