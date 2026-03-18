import redisClient from "../config/redis"

//  Default TTL 
// TTL = Time To Live = how long cache stays valid
// After TTL expires Redis automatically deletes the key
const DEFAULT_TTL = 300 // 5 minutes in seconds

//  Get From Cache 
// Returns parsed data or null if not found
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key)

    if (!data) return null

    // Redis stores everything as strings
    // Parse it back to the original object
    return JSON.parse(data) as T
  } catch (error) {
    // If Redis fails — return null → app falls back to MongoDB
    console.error("Cache get error:", error)
    return null
  }
}

//  Set Cache 
// Stores data as JSON string with expiry
export const setCache = async (
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL
): Promise<void> => {
  try {
    await redisClient.setEx(
      key,
      ttl,
      JSON.stringify(data) // Redis only stores strings — must stringify
    )
  } catch (error) {
    // If Redis fails — silently continue
    // Data will just be fetched from MongoDB next time
    console.error("Cache set error:", error)
  }
}

//  Delete Cache 
// Called when data changes — invalidates stale cache
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error("Cache delete error:", error)
  }
}

//  Delete Multiple Keys by Pattern 
// Deletes all cache keys matching a pattern
// Used to clear all cached data for a specific user
// Example: deleteByPattern("jobs:user123:*")
// Deletes: "jobs:user123:stats", "jobs:user123:all" etc
export const deleteByPattern = async (pattern: string): Promise<void> => {
  try {
    // KEYS command finds all keys matching pattern
    const keys = await redisClient.keys(pattern)

    if (keys.length === 0) return

    // Delete all matching keys at once
    await redisClient.del(keys)
  } catch (error) {
    console.error("Cache delete pattern error:", error)
  }
}