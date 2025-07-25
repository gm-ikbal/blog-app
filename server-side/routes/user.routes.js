import express from 'express'
import verifyUser from '../Utils/verify.js'
import { userUpdate } from '../controllers/user.controller.js'
const router = express.Router()

//router.post('/user', Auth)
router.put('/update/:userId', verifyUser, userUpdate)



export default router