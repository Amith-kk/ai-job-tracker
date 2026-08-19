import mongoose from "mongoose"
import dns from "node:dns"

// Force IPv4 resolution to prevent Node.js v18+ IPv6 connection timeouts
dns.setDefaultResultOrder("ipv4first")
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

const conn = await mongoose.connect(mongoURI, {
      family: 4, // Force IPv4 for Mongoose connection sockets
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    // Exit process with failure — app cannot run without database
    process.exit(1)
  }
}

export default connectDB