import express from 'express'
import { connectDB } from './connection.js'
import userRoutes from './routes/user.routes.js'
import AuthRoute from './routes/auth.route.js'
import imageRoutes from './routes/image.routes.js'
import postImageRoutes from './routes/postImage.routes.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB()


app.use('/user', userRoutes)
app.use('/user' , AuthRoute)
app.use('/image', imageRoutes)
app.use('/post-image', postImageRoutes)



//middleware for error handling 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});




app.listen(3000, () => {
    console.log("Server is running on port 3000!!")
})

