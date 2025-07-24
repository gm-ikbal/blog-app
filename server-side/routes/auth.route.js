import express from 'express'
import { register, signin,googleAuth} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/registration', register)
router.post('/signin' , signin)
router.post('/google',googleAuth)


export default router