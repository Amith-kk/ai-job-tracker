import { Router } from "express"
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getStats
} from "../controllers/job.controller"
import { protect } from "../middleware/auth.middleware"
import validate from "../middleware/validate.middleware"
import { createJobSchema, updateJobSchema } from "../validations/job.validation"

const router = Router()

// ─── Apply protect middleware to ALL routes in this router ─
// Instead of adding protect to every single route
// use() applies it to everything below it in this file
// Every job route requires authentication — no exceptions
router.use(protect)

// ─── Job Routes ────────────────────────────────────────────
// GET  /api/jobs/stats  → must be BEFORE /:id route
// Why? Express matches routes top to bottom
// If /:id was first — "stats" would be treated as an ID
router.get("/stats", getStats)

// GET    /api/jobs          → get all jobs (with optional filters)
// POST   /api/jobs          → create new job
router.route("/")
  .get(getAll)
  .post(validate(createJobSchema), create)

// GET    /api/jobs/:id      → get one job
// PUT    /api/jobs/:id      → update job
// DELETE /api/jobs/:id      → delete job
router.route("/:id")
  .get(getOne)
  .put(validate(updateJobSchema), update)
  .delete(remove)

export default router