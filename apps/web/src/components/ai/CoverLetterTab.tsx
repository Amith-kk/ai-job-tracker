import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { aiService } from "@/services/ai.service"
import Button from "@/components/ui/Button"

const CoverLetterTab = () => {
  const [jobDescription, setJobDescription] = useState("")
  const [copied, setCopied] = useState(false)

  // ─── Generate Mutation ────────────────────────────────
  const mutation = useMutation({
    mutationFn: () => aiService.generateCoverLetter(jobDescription)
  })

  // ─── Copy to Clipboard ────────────────────────────────
  const handleCopy = async () => {
    if (!mutation.data) return
    await navigator.clipboard.writeText(mutation.data)
    setCopied(true)
    // Reset "Copied!" back to "Copy" after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Input Side */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-1">
          Job Description
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste the full job description from the posting
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="We are looking for a Full Stack Developer with experience in React, Node.js..."
          className="input-field min-h-64 resize-none mb-4"
        />

        {/* Character count */}
        <p className="text-xs text-gray-400 mb-4">
          {jobDescription.length} characters
          {jobDescription.length < 50 && jobDescription.length > 0 && (
            <span className="text-red-500 ml-2">
              (minimum 50 characters)
            </span>
          )}
        </p>

        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={jobDescription.length < 50}
          fullWidth
        >
          {mutation.isPending ? "Generating..." : "✨ Generate Cover Letter"}
        </Button>
      </div>

      {/* Output Side */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Generated Cover Letter
          </h3>
          {mutation.data && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </Button>
          )}
        </div>

        {/* Loading state */}
        {mutation.isPending && (
          <div className="flex flex-col items-center justify-center
                          min-h-64 gap-3">
            <div className="animate-spin text-4xl">⚡</div>
            <p className="text-sm text-gray-500">
              AI is writing your cover letter...
            </p>
          </div>
        )}

        {/* Error state */}
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">
              Failed to generate. Please try again.
            </p>
          </div>
        )}

        {/* Result */}
        {mutation.data && !mutation.isPending && (
          <div className="bg-gray-50 rounded-lg p-4 min-h-64">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {mutation.data}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!mutation.data && !mutation.isPending && !mutation.isError && (
          <div className="flex flex-col items-center justify-center
                          min-h-64 text-center">
            <p className="text-4xl mb-3">✉️</p>
            <p className="text-sm text-gray-500">
              Your cover letter will appear here
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default CoverLetterTab