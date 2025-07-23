import express from 'express'
import { connectDB } from './connection.js'
import userRoutes from './routes/user.routes.js'
import AuthRoute from './routes/auth.route.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()

app.use('/api/user', userRoutes)

app.use('/user' , AuthRoute)

app.listen(3000, () => {
    console.log("Server is running on port 3000!!")
})

