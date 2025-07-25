import express from 'express'
import verifyUser from '../Utils/verify.js'
import { userUpdate, userDelete, userSignOut } from '../controllers/user.controller.js'
const router = express.Router()


router.put('/update/:userId', verifyUser, userUpdate)
router.delete('/delete/:userId', verifyUser, userDelete)
router.post('/signout', userSignOut)

export default router