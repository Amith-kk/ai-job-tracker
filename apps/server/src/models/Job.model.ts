import mongoose, { Document, Schema } from "mongoose"
import { JobStatus } from "@repo/types"

//  Interface 
export interface IJob extends Document {
  userId: mongoose.Types.ObjectId
  company: string
  role: string
  status: JobStatus
  jobDescription?: string
  notes?: string
  appliedDate: Date
  createdAt: Date
  updatedAt: Date
}

//  Schema 
const JobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",                   // references the User model
      required: [true, "User ID is required"]
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"]
    },
    status: {
      type: String,
      enum: {
        values: ["wishlist", "applied", "interview", "offer", "rejected"],
        message: "{VALUE} is not a valid status"
      },
      default: "applied"
    },
    jobDescription: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

//  Index 
// Makes querying jobs by userId significantly faster
// Without index — MongoDB scans every document in the collection
// With index — MongoDB jumps directly to matching documents
JobSchema.index({ userId: 1 })
JobSchema.index({ userId: 1, status: 1 })

const Job = mongoose.model<IJob>("Job", JobSchema)

export default Job 