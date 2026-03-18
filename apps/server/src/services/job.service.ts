import Job, { IJob } from "../models/Job.model"
import { CreateJobInput, UpdateJobInput } from "../validations/job.validation"
import { getCache, setCache, deleteByPattern } from "../utils/cache.utils"

//  Cache TTL Constants 
const STATS_TTL = 300   // 5 minutes
const JOBS_TTL = 60     // 1 minute

//  Cache Key Helpers 
// Centralized key generation — change key format in one place
const cacheKeys = {
  stats: (userId: string) => `jobs:stats:${userId}`,
  all: (userId: string, filters: string) => `jobs:all:${userId}:${filters}`,
  one: (jobId: string) => `jobs:one:${jobId}`,
  userPattern: (userId: string) => `jobs:*:${userId}*`
}

//  Create Job 
export const createJob = async (
  userId: string,
  data: CreateJobInput["body"]
): Promise<IJob> => {
  const job = await Job.create({
    userId,
    ...data,
    appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date()
  })

  // Invalidate all job caches for this user
  // Their job list and stats are now outdated
  await deleteByPattern(cacheKeys.userPattern(userId))

  return job
}

//  Get All Jobs 
export const getAllJobs = async (
  userId: string,
  filters: { status?: string; sort?: string }
): Promise<IJob[]> => {

  // Create unique cache key including filters
  // Different filters = different cached results
  const filterString = JSON.stringify(filters)
  const cacheKey = cacheKeys.all(userId, filterString)

  // 1. Check cache first
  const cached = await getCache<IJob[]>(cacheKey)
  if (cached) {
    console.log("📦 Cache hit: jobs list")
    return cached
  }

  // 2. Cache miss — fetch from MongoDB
  console.log("🔍 Cache miss: fetching jobs from MongoDB")
  const query: Record<string, unknown> = { userId }

  if (filters.status && filters.status !== "all") {
    query.status = filters.status
  }

  const sortOrder = filters.sort === "oldest" ? 1 : -1
  const jobs = await Job.find(query).sort({ createdAt: sortOrder })

  // 3. Store in cache for next request
  await setCache(cacheKey, jobs, JOBS_TTL)

  return jobs
}

//  Get Single Job 
export const getJobById = async (
  jobId: string,
  userId: string
): Promise<IJob> => {
  // Check cache
  const cacheKey = cacheKeys.one(jobId)
  const cached = await getCache<IJob>(cacheKey)

  if (cached) {
    // Still verify ownership even on cached data
    if (cached.userId.toString() !== userId) {
      throw new Error("Job not found")
    }
    console.log("📦 Cache hit: single job")
    return cached
  }

  // Cache miss — fetch from MongoDB
  const job = await Job.findById(jobId)

  if (!job) throw new Error("Job not found")

  if (job.userId.toString() !== userId) {
    throw new Error("Job not found")
  }

  // Cache the job
  await setCache(cacheKey, job, JOBS_TTL)

  return job
}

// ─── Update Job ───────────────────────────────────────────
export const updateJob = async (
  jobId: string,
  userId: string,
  data: UpdateJobInput["body"]
): Promise<IJob> => {
  await getJobById(jobId, userId)

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      ...data,
      ...(data.appliedDate && { appliedDate: new Date(data.appliedDate) })
    },
    { new: true, runValidators: true }
  )

  if (!updatedJob) throw new Error("Job not found")

  // Invalidate this specific job cache AND all list/stats caches
  await deleteByPattern(cacheKeys.userPattern(userId))

  return updatedJob
}

// ─── Delete Job ───────────────────────────────────────────
export const deleteJob = async (
  jobId: string,
  userId: string
): Promise<void> => {
  await getJobById(jobId, userId)
  await Job.findByIdAndDelete(jobId)

  // Invalidate all caches for this user
  await deleteByPattern(cacheKeys.userPattern(userId))
}

// ─── Get Job Stats ────────────────────────────────────────
export const getJobStats = async (
  userId: string
): Promise<Record<string, number>> => {
  const cacheKey = cacheKeys.stats(userId)

  // 1. Check cache
  const cached = await getCache<Record<string, number>>(cacheKey)
  if (cached) {
    console.log("📦 Cache hit: job stats")
    return cached
  }

  // 2. Cache miss — run expensive aggregation
  console.log("🔍 Cache miss: running aggregation")
  const mongoose = require("mongoose")
  const stats = await Job.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ])

  const result: Record<string, number> = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    total: 0
  }

  stats.forEach((stat: { _id: string; count: number }) => {
    result[stat._id] = stat.count
    result.total += stat.count
  })

  // 3. Cache for 5 minutes
  await setCache(cacheKey, result, STATS_TTL)

  return result
}