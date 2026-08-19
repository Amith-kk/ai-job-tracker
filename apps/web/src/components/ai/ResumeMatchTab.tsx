import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { aiService } from "@/services/ai.service"
import Button from "@/components/ui/Button"

// ─── Match Score Circle ───────────────────────────────────
// Visual circular score indicator
const ScoreCircle = ({ score }: { score: number }) => {
  // Color changes based on score
  const color =
    score >= 70 ? "#10B981" :  // green — good match
    score >= 40 ? "#F59E0B" :  // yellow — partial match
    "#EF4444"                   // red — poor match

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center
                   text-2xl font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {score}%
      </div>
      <p className="text-sm font-medium text-gray-700">
        {score >= 70 ? "Strong Match 🎉" :
         score >= 40 ? "Partial Match 👍" :
         "Needs Work 💪"}
      </p>
    </div>
  )
}

const ResumeMatchTab = () => {
  const [jobDescription, setJobDescription] = useState("")
  const [userSkills, setUserSkills] = useState("")

  const mutation = useMutation({
    mutationFn: () => aiService.analyzeMatch(jobDescription, userSkills)
  })

  const canSubmit = jobDescription.length >= 50 && userSkills.length >= 10

  return (
    <div className="space-y-6">

      {/* Inputs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Job Description */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Job Description
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Paste the job posting you want to analyze
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="We are looking for a React developer..."
            className="input-field min-h-48 resize-none"
          />
        </div>

        {/* Your Skills */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-1">
            Your Skills
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            List your current technical skills
          </p>
          <textarea
            value={userSkills}
            onChange={(e) => setUserSkills(e.target.value)}
            placeholder="React, Node.js, TypeScript, MongoDB, Express, JWT, Redis, Git, Tailwind CSS..."
            className="input-field min-h-48 resize-none"
          />
        </div>

      </div>

      {/* Analyze Button */}
      <Button
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        disabled={!canSubmit}
        size="lg"
      >
        {mutation.isPending ? "Analyzing..." : "🎯 Analyze Match"}
      </Button>

      {/* Loading */}
      {mutation.isPending && (
        <div className="card flex flex-col items-center py-12 gap-3">
          <div className="animate-spin text-4xl">🔍</div>
          <p className="text-sm text-gray-500">
            Analyzing your profile against the job requirements...
          </p>
        </div>
      )}

      {/* Results */}
      {mutation.data && !mutation.isPending && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Score */}
          <div className="card flex flex-col items-center justify-center py-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Match Score
            </h3>
            <ScoreCircle score={mutation.data.matchScore} />
          </div>

          {/* Skills Breakdown */}
          <div className="card lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Present Skills */}
              <div>
                <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  ✅ You Have
                </h4>
                <div className="space-y-2">
                  {mutation.data.presentSkills.map((skill, i) => (
                    <div
                      key={i}
                      className="bg-green-50 text-green-700 px-3 py-1.5
                                 rounded-lg text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  ❌ You're Missing
                </h4>
                <div className="space-y-2">
                  {mutation.data.missingSkills.map((skill, i) => (
                    <div
                      key={i}
                      className="bg-red-50 text-red-700 px-3 py-1.5
                                 rounded-lg text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Suggestions */}
          <div className="card lg:col-span-3">
            <h3 className="font-semibold text-gray-900 mb-4">
              💡 Suggestions to Improve Your Match
            </h3>
            <div className="space-y-3">
              {mutation.data.suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-blue-50
                             rounded-lg"
                >
                  <span className="text-primary-600 font-bold
                                   text-sm flex-shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Error */}
      {mutation.isError && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            Analysis failed. Please try again.
          </p>
        </div>
      )}

    </div>
  )
}

export default ResumeMatchTab