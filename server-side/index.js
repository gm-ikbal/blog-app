import express from 'express'
import { connectDB } from './connection.js'
import userRoutes from './routes/user.routes.js'

import dotenv from 'dotenv'
dotenv.config()
const app = express()
connectDB()

app.use('/api/user', userRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000!!")
})

