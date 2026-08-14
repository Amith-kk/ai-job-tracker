import { JobStatus } from "@repo/types"

interface BadgeProps {
  status: JobStatus
}

// Maps each status to its badge class defined in index.css
const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  wishlist:  { label: "Wishlist",  className: "badge-wishlist" },
  applied:   { label: "Applied",   className: "badge-applied" },
  interview: { label: "Interview", className: "badge-interview" },
  offer:     { label: "Offer",     className: "badge-offer" },
  rejected:  { label: "Rejected",  className: "badge-rejected" },
}

const Badge = ({ status }: BadgeProps) => {
  const config = statusConfig[status]

  return (
    <span className={config.className}>
      {config.label}
    </span>
  )
}

export default Badge