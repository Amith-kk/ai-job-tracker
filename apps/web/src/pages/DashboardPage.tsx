import { useQuery } from "@tanstack/react-query"
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { jobService } from "@/services/job.service"

// ─── Chart Colors ─────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  wishlist:  "#8B5CF6",  // purple
  applied:   "#3B82F6",  // blue
  interview: "#F59E0B",  // yellow
  offer:     "#10B981",  // green
  rejected:  "#EF4444",  // red
}

// ─── Stat Card Component ──────────────────────────────────
// Small reusable card for each status count
interface StatCardProps {
  label: string
  count: number
  color: string
  emoji: string
}

const StatCard = ({ label, count, color, emoji }: StatCardProps) => (
  <div className="card flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
      style={{ backgroundColor: `${color}20` }}  // 20 = 12% opacity in hex
    >
      {emoji}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
)

// ─── Dashboard Page ───────────────────────────────────────
const DashboardPage = () => {

  // Fetch stats from GET /api/jobs/stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["jobStats"],
    queryFn: jobService.getStats
  })

  // Transform stats object into array for Recharts
  // Recharts needs: [{ name: "Applied", value: 5 }, ...]
  const chartData = stats
    ? Object.entries(STATUS_COLORS).map(([status]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: stats[status] || 0,
        color: STATUS_COLORS[status]
      })).filter(item => item.value > 0)  // only show statuses with jobs
    : []

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="p-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Your job search at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Applications"
          count={stats?.total || 0}
          color="#6366F1"
          emoji="📋"
        />
        <StatCard
          label="Interviews"
          count={stats?.interview || 0}
          color="#F59E0B"
          emoji="🎯"
        />
        <StatCard
          label="Offers"
          count={stats?.offer || 0}
          color="#10B981"
          emoji="🎉"
        />
        <StatCard
          label="Applied"
          count={stats?.applied || 0}
          color="#3B82F6"
          emoji="📤"
        />
      </div>

      {/* Charts Row */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              Application Status
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}   // donut hole
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} jobs`, ""]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              Applications by Status
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} jobs`, "Count"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      ) : (
        // Empty state — no jobs yet
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500 mt-2">
            Add your first job application to see stats here
          </p>
        </div>
      )}

    </div>
  )
}

export default DashboardPage