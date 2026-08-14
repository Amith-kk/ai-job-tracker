import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { jobService } from "@/services/job.service"
import { Job, JobStatus } from "@repo/types"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import JobFormModal from "@/components/jobs/JobFormModal"

// ─── Status Filter Options ────────────────────────────────
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
]

const JobsPage = () => {
  const queryClient = useQueryClient()

  // ─── Local State ───────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("latest")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  // ─── Fetch Jobs ────────────────────────────────────────
  // queryKey includes filters — when filters change React Query refetches
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", statusFilter, sortOrder],
    queryFn: () => jobService.getAll({
      status: statusFilter,
      sort: sortOrder
    })
  })

  // ─── Delete Mutation ───────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: jobService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobStats"] })
    }
  })

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this application?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingJob(null)
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Applications
          </h1>
          <p className="text-gray-500 mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          + Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium
                transition-colors duration-150
                ${statusFilter === filter.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin text-4xl">⏳</div>
        </div>

      ) : jobs.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-900">
            No applications found
          </h3>
          <p className="text-gray-500 mt-2 mb-4">
            {statusFilter === "all"
              ? "Add your first job application to get started"
              : `No ${statusFilter} applications yet`
            }
          </p>
          {statusFilter === "all" && (
            <Button onClick={() => setIsModalOpen(true)}>
              + Add Application
            </Button>
          )}
        </div>

      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">

                {/* Job Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Company Avatar */}
                  <div className="w-10 h-10 rounded-lg bg-primary-100
                                  text-primary-700 flex items-center
                                  justify-center font-bold text-sm flex-shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {job.company}
                      </h3>
                      <Badge status={job.status as JobStatus} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {job.role}
                    </p>
                    {job.notes && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        📝 {job.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date + Actions */}
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(job.appliedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>

                  <button
                    onClick={() => handleEdit(job)}
                    className="text-gray-400 hover:text-primary-600
                               transition-colors p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-gray-400 hover:text-red-600
                               transition-colors p-1"
                    title="Delete"
                    disabled={deleteMutation.isPending}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={editingJob}
      />

    </div>
  )
}

export default JobsPage