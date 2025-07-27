import express from 'express'
import verifyUser from '../Utils/verify.js'
import { userUpdate, userDelete, userSignOut, getUser } from '../controllers/user.controller.js'
const router = express.Router()


router.put('/update/:userId', verifyUser, userUpdate)
router.delete('/delete/:userId', verifyUser, userDelete)
router.post('/signout', userSignOut)
router.get('/getuser', verifyUser, getUser)

export default router