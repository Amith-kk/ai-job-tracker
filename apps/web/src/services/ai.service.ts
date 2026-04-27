import axios from "@/lib/axios"

export const aiService = {
  // Generate cover letter
  generateCoverLetter: async (jobDescription: string): Promise<string> => {
    const response = await axios.post("/ai/cover-letter", { jobDescription })
    return response.data.data.coverLetter
  },

  // Analyze resume match
  analyzeMatch: async (
    jobDescription: string,
    userSkills: string
  ): Promise<{
    matchScore: number
    presentSkills: string[]
    missingSkills: string[]
    suggestions: string[]
  }> => {
    const response = await axios.post("/ai/match-resume", {
      jobDescription,
      userSkills
    })
    return response.data.data
  },

  // Generate interview questions
  generateInterviewQuestions: async (
    jobDescription: string,
    role: string
  ): Promise<{
    technical: string[]
    behavioral: string[]
    roleSpecific: string[]
  }> => {
    const response = await axios.post("/ai/interview-prep", {
      jobDescription,
      role
    })
    return response.data.data
  }
}