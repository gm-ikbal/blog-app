import express from 'express'
import { register, signin, googleAuth, signout, getCurrentUser } from '../controllers/auth.controller.js'
import verifyUser from '../Utils/verify.js'

const router = express.Router()

router.post('/registration', register)
router.post('/signin', signin)
router.post('/google', googleAuth)
router.post('/signout', signout)
router.get('/me', verifyUser, getCurrentUser)

export default router