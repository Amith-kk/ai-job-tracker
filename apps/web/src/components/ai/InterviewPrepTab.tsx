import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { aiService } from "@/services/ai.service"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// ─── Question Section ─────────────────────────────────────
// Reusable section for each question category
interface QuestionSectionProps {
  title: string
  emoji: string
  questions: string[]
  bgColor: string
  textColor: string
}

const QuestionSection = ({
  title, emoji, questions, bgColor, textColor
}: QuestionSectionProps) => (
  <div className="card">
    <h3 className={`font-semibold mb-4 flex items-center gap-2 ${textColor}`}>
      <span>{emoji}</span> {title}
    </h3>
    <div className="space-y-3">
      {questions.map((question, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg ${bgColor}`}
        >
          <p className="text-sm text-gray-700">
            <span className={`font-bold ${textColor} mr-2`}>
              Q{i + 1}.
            </span>
            {question}
          </p>
        </div>
      ))}
    </div>
  </div>
)

const InterviewPrepTab = () => {
  const [jobDescription, setJobDescription] = useState("")
  const [role, setRole] = useState("")

  const mutation = useMutation({
    mutationFn: () => aiService.generateInterviewQuestions(
      jobDescription,
      role
    )
  })

  const canSubmit = jobDescription.length >= 50 && role.length >= 2

  return (
    <div className="space-y-6">

      {/* Input Card */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">
          Job Details
        </h3>

        <div className="space-y-4">
          <Input
            label="Role / Job Title"
            placeholder="Full Stack Developer, React Developer..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="input-field min-h-40 resize-none"
            />
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!canSubmit}
          className="mt-4"
        >
          {mutation.isPending
            ? "Generating questions..."
            : "🎤 Generate Interview Questions"
          }
        </Button>
      </div>

      {/* Loading */}
      {mutation.isPending && (
        <div className="card flex flex-col items-center py-12 gap-3">
          <div className="animate-spin text-4xl">🤔</div>
          <p className="text-sm text-gray-500">
            Preparing your interview questions...
          </p>
        </div>
      )}

      {/* Results */}
      {mutation.data && !mutation.isPending && (
        <div className="space-y-4">

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">
              💡 Tip: Practice answering these out loud.
              Use the STAR method for behavioral questions
              (Situation, Task, Action, Result).
            </p>
          </div>

          <QuestionSection
            title="Technical Questions"
            emoji="⚙️"
            questions={mutation.data.technical}
            bgColor="bg-purple-50"
            textColor="text-purple-700"
          />

          <QuestionSection
            title="Behavioral Questions"
            emoji="🧠"
            questions={mutation.data.behavioral}
            bgColor="bg-yellow-50"
            textColor="text-yellow-700"
          />

          <QuestionSection
            title="Role-Specific Questions"
            emoji="🎯"
            questions={mutation.data.roleSpecific}
            bgColor="bg-green-50"
            textColor="text-green-700"
          />

        </div>
      )}

      {/* Error */}
      {mutation.isError && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            Failed to generate questions. Please try again.
          </p>
        </div>
      )}

    </div>
  )
}

export default InterviewPrepTab