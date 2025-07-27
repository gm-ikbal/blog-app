import express from 'express'
import verifyUser from '../Utils/verify.js'
import { userUpdate, userDelete, userSignOut, getUser, makeAdmin, getUserById } from '../controllers/user.controller.js'
const router = express.Router()


router.put('/update/:userId', verifyUser, userUpdate)
router.delete('/delete/:userId', verifyUser, userDelete)
router.post('/signout', userSignOut)
router.get('/getuser', verifyUser, getUser)
router.put('/makeadmin/:userId', verifyUser, makeAdmin)
router.delete('/deleteuser/:userId/:currentUserId', verifyUser, userDelete)
router.get('/:userId', getUserById)


export default router