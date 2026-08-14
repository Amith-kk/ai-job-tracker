import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { jobService } from "@/services/job.service"
import { jobSchema, JobInput } from "@/validations/job.validation"
import { Job } from "@repo/types"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

interface JobFormModalProps {
  isOpen: boolean
  onClose: () => void
  job?: Job | null  // if provided — edit mode, otherwise — create mode
}

const JobFormModal = ({ isOpen, onClose, job }: JobFormModalProps) => {
  // React Query's way to invalidate/refetch queries after mutation
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: "applied"  // default status for new jobs
    }
  })

  // When editing — populate form with existing job data
  useEffect(() => {
    if (job) {
      reset({
        company: job.company,
        role: job.role,
        status: job.status,
        jobDescription: job.jobDescription || "",
        notes: job.notes || "",
      })
    } else {
      reset({ status: "applied" })
    }
  }, [job, reset])

  // ─── Create Mutation ───────────────────────────────────
  const createMutation = useMutation({
    mutationFn: jobService.create,
    onSuccess: () => {
      // Invalidate jobs and stats queries → React Query refetches them
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobStats"] })
      onClose()
      reset()
    }
  })

  // ─── Update Mutation ───────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobInput> }) =>
      jobService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobStats"] })
      onClose()
    }
  })

  const onSubmit = (data: JobInput) => {
    if (job) {
      updateMutation.mutate({ id: job._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  // Don't render if not open
  if (!isOpen) return null

  return (
    // Backdrop — clicking outside closes modal
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center
                 justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal — stop click from bubbling to backdrop */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6
                        border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {job ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

          <Input
            label="Company"
            placeholder="Google, Razorpay, Swiggy..."
            error={errors.company?.message}
            required
            {...register("company")}
          />

          <Input
            label="Role"
            placeholder="Frontend Developer, Full Stack Engineer..."
            error={errors.role?.message}
            required
            {...register("role")}
          />

          {/* Status Select */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              className="input-field"
              {...register("status")}
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Job Description
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              className="input-field min-h-24 resize-none"
              placeholder="Paste the job description here for AI features..."
              {...register("jobDescription")}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Notes
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              className="input-field min-h-20 resize-none"
              placeholder="Interview date, contact person, referral..."
              {...register("notes")}
            />
          </div>

          {/* Error */}
          {(createMutation.isError || updateMutation.isError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                Failed to save. Please try again.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
            >
              {job ? "Save Changes" : "Add Application"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default JobFormModal