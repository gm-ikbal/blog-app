import express from 'express'
import { createPost, getposts, deletePost, updatePost, getPostBySlug, getRecentPosts, searchPosts } from '../controllers/post.controller.js'    
import verifyUser from '../Utils/verify.js'
const router = express.Router()

router.post('/createpost', verifyUser, createPost)
router.get('/getposts', verifyUser, getposts)
router.get('/search', searchPosts) // Public route for searching posts
router.get('/getpost/:slug', getPostBySlug) // Public route for getting post by slug
router.get('/recent', getRecentPosts) // Public route for getting recent posts
router.get('/:slug', getPostBySlug) // Public route for getting post by slug (matches React app URL structure)
router.delete('/deletepost/:postid', verifyUser, deletePost)
router.put('/updatepost/:postid', verifyUser, updatePost)

export default router