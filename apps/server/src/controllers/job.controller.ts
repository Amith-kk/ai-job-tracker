import { Request, Response } from "express"
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
} from "../services/job.service"
import { sendSuccess, sendError } from "../utils/apiResponse.utils"
// Express types params as string | string[]
// This helper safely extracts a single string value
const getParam = (param: string | string[]): string => 
  Array.isArray(param) ? param[0] : param

//  Create Job 
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user.id is set by auth middleware — guaranteed to exist on protected routes
    const job = await createJob(req.user!.id, req.body)
    sendSuccess(res, job, "Job created successfully", 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create job"
    sendError(res, message, 500)
  }
}

//  Get All Jobs 
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query params for filtering and sorting
    // GET /api/jobs?status=applied&sort=latest
    const { status, sort } = req.query as { status?: string; sort?: string }

    const jobs = await getAllJobs(req.user!.id, { status, sort })
    sendSuccess(res, jobs, "Jobs fetched successfully")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch jobs"
    sendError(res, message, 500)
  }
}

//  Get Single Job 
export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.params.id = the :id part from /api/jobs/:id
    const job = await getJobById(getParam(req.params.id), req.user!.id)
    sendSuccess(res, job, "Job fetched successfully")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch job"
    const statusCode = message === "Job not found" ? 404 : 500
    sendError(res, message, statusCode)
  }
}

//  Update Job 
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await updateJob(getParam(req.params.id), req.user!.id, req.body)
    sendSuccess(res, job, "Job updated successfully")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update job"
    const statusCode = message === "Job not found" ? 404 : 500
    sendError(res, message, statusCode)
  }
}

//  Delete Job 
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteJob(getParam(req.params.id), req.user!.id)
    // 204 = No Content — success but nothing to return
    // Standard HTTP status for successful deletes
    sendSuccess(res, null, "Job deleted successfully", 200)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete job"
    const statusCode = message === "Job not found" ? 404 : 500
    sendError(res, message, statusCode)
  }
}

//  Get Stats 
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getJobStats(req.user!.id)
    sendSuccess(res, stats, "Stats fetched successfully")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats"
    sendError(res, message, 500)
  }
}