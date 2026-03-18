import { createClient } from "redis"

//  Create Redis Client 
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
})

//  Handle Connection Events 
redisClient.on("connect", () => {
  console.log("🔴 Redis connecting...")
})

redisClient.on("ready", () => {
  console.log("✅ Redis connected and ready")
})

redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error)
})

redisClient.on("end", () => {
  console.log("Redis connection closed")
})

//  Connect Function 
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect()
  } catch (error) {
    console.error("❌ Redis connection failed:", error)
  }
}

export default redisClient
