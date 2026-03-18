import express, { Application, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db"
import { connectRedis } from "./config/redis"
import authRoutes from "./routes/auth.routes"
import jobRoutes from "./routes/job.routes"


// Load environment variables 
dotenv.config()

// Connect to database
connectDB()

connectRedis()

const app: Application = express()
const PORT = process.env.PORT || 5000

// Middleware
// Parse incoming JSON requests
app.use(express.json())

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))

// Allow frontend to call this backend
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  credentials: true
}))


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)


//  Health Check Route
// Used by Docker, deployment platforms to verify server is alive
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}) 

//  Start Server 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})

export default app
