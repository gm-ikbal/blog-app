import express from 'express'
import { connectDB } from './connection.js'

import dotenv from 'dotenv'
dotenv.config()
const app = express()
connectDB()
app.listen(3000, () => {
    console.log("Server is running on port 3000!!")
})