import { useState } from "react"
import CoverLetterTab from "@/components/ai/CoverLetterTab"
import ResumeMatchTab from "@/components/ai/ResumeMatchTab"
import InterviewPrepTab from "@/components/ai/InterviewPrepTab"

// ─── Tab Definitions ──────────────────────────────────────
const TABS = [
  {
    id: "cover-letter",
    label: "Cover Letter",
    emoji: "✉️",
    description: "Generate a tailored cover letter"
  },
  {
    id: "resume-match",
    label: "Resume Match",
    emoji: "🎯",
    description: "Analyze how well you match a job"
  },
  {
    id: "interview-prep",
    label: "Interview Prep",
    emoji: "🎤",
    description: "Get likely interview questions"
  }
]

const AIToolsPage = () => {
  const [activeTab, setActiveTab] = useState("cover-letter")

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          AI Tools
        </h1>
        <p className="text-gray-500 mt-1">
          Powered by AI to supercharge your job search
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium
              border-b-2 transition-colors duration-150 -mb-px
              ${activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }
            `}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "cover-letter" && <CoverLetterTab />}
      {activeTab === "resume-match" && <ResumeMatchTab />}
      {activeTab === "interview-prep" && <InterviewPrepTab />}

    </div>
  )
}

export default AIToolsPage