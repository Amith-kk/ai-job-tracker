import Job, { IJob } from "../models/Job.model"
import { CreateJobInput, UpdateJobInput } from "../validations/job.validation"

//  Create Job 
// Takes validated data + userId from auth middleware
// Creates job in MongoDB and returns it
export const createJob = async (
  userId: string,
  data: CreateJobInput["body"]
): Promise<IJob> => {
  const job = await Job.create({
    userId,
    ...data,
    // Convert string date to Date object if provided
    // Otherwise use current date as default
    appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date()
  })

  return job
}

// ─── Get All Jobs ─────────────────────────────────────────
// CRITICAL: Always filter by userId
// User can only ever see THEIR jobs — never another user's
// Optional status filter — GET /api/jobs?status=applied
// Optional sort — GET /api/jobs?sort=latest or sort=oldest
export const getAllJobs = async (
  userId: string,
  filters: {
    status?: string
    sort?: string
  }
): Promise<IJob[]> => {

  // Start building query — userId filter is ALWAYS applied
  const query: Record<string, unknown> = { userId }

  // If status filter provided — add it to query
  // GET /api/jobs?status=applied → only returns applied jobs
  if (filters.status && filters.status !== "all") {
    query.status = filters.status
  }

  // Sort direction — latest first by default
  const sortOrder = filters.sort === "oldest" ? 1 : -1

  const jobs = await Job
    .find(query)
    .sort({ createdAt: sortOrder })  // newest jobs first by default

  return jobs
}

// ─── Get Single Job ───────────────────────────────────────
// Finds ONE job by its MongoDB _id
// Then verifies it belongs to the requesting user
// This is called an OWNERSHIP CHECK — critical for security
export const getJobById = async (
  jobId: string,
  userId: string
): Promise<IJob> => {
  const job = await Job.findById(jobId)

  // Job doesn't exist at all
  if (!job) {
    throw new Error("Job not found")
  }

  // Job exists but belongs to a different user
  // We throw the same "not found" error — never confirm to an attacker
  // that a resource exists but they can't access it
  if (job.userId.toString() !== userId) {
    throw new Error("Job not found")
  }

  return job
}

// ─── Update Job ───────────────────────────────────────────
// First verifies ownership by calling getJobById
// Then updates only the fields that were sent
// { new: true } returns the UPDATED document not the old one
export const updateJob = async (
  jobId: string,
  userId: string,
  data: UpdateJobInput["body"]
): Promise<IJob> => {
  // This handles both "not found" AND "not your job" cases
  await getJobById(jobId, userId)

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    {
      ...data,
      // Convert date string if provided
      ...(data.appliedDate && { appliedDate: new Date(data.appliedDate) })
    },
    {
      new: true,           // return updated document
      runValidators: true  // run mongoose schema validators on update too
    }
  )

  if (!updatedJob) {
    throw new Error("Job not found")
  }

  return updatedJob
}

// ─── Delete Job ───────────────────────────────────────────
// Verifies ownership first then deletes
export const deleteJob = async (
  jobId: string,
  userId: string
): Promise<void> => {
  // Ownership check first
  await getJobById(jobId, userId)

  await Job.findByIdAndDelete(jobId)
}

// ─── Get Job Stats ────────────────────────────────────────
// Returns count of jobs per status for dashboard charts
// This is what powers the Recharts pie/bar chart on frontend
// MongoDB aggregation pipeline — groups and counts documents
export const getJobStats = async (
  userId: string
): Promise<Record<string, number>> => {
  const stats = await Job.aggregate([
    // Stage 1: Only look at this user's jobs
    { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },

    // Stage 2: Group by status and count each group
    {
      $group: {
        _id: "$status",   // group by the status field
        count: { $sum: 1 } // count documents in each group
      }
    }
  ])

  // Convert array format to object format
  // From: [{ _id: "applied", count: 5 }, { _id: "rejected", count: 3 }]
  // To:   { applied: 5, rejected: 3, interview: 0, ... }
  const result: Record<string, number> = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    total: 0
  }

  stats.forEach(stat => {
    result[stat._id] = stat.count
    result.total += stat.count
  })

  return result
}