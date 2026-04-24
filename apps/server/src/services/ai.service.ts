import Groq from "groq-sdk"
import crypto from "crypto"
import { getCache, setCache } from "../utils/cache.utils"

// ─── Initialize Gemini ────────────────────────────────────
// Read API key at call time — not module level
// Same lesson as JWT_SECRET — never read process.env at top level
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined")
  }

  return new Groq({
    apiKey
  })
}

// ─── Cache TTL ────────────────────────────────────────────
const AI_CACHE_TTL = 86400 // 24 hours in seconds
// AI responses for same input are always identical
// Cache for 24 hours — no point regenerating same content

// ─── Hash Helper ─────────────────────────────────────────
// Creates unique fingerprint of text for cache key
// Same text = same hash = same cache key = cached response returned
const createHash = (text: string): string => {
  return crypto
    .createHash("md5")
    .update(text.toLowerCase().trim()) // normalize before hashing
    .digest("hex")
}

// ─── Generate Cover Letter ────────────────────────────────
export const generateCoverLetter = async (
  jobDescription: string,
  userName: string
): Promise<string> => {

  // 1. Create cache key from job description hash
  const hash = createHash(jobDescription)
  const cacheKey = `ai:cover-letter:${hash}`

  // 2. Check cache first
  const cached = await getCache<string>(cacheKey)
  if (cached) {
    console.log("📦 Cache hit: cover letter")
    return cached
  }

  console.log("🤖 Generating cover letter with Groq...")

  // 3. Build prompt — clear instructions = better output
  const prompt = `
You are an expert career coach helping a Full Stack Developer 
write a professional job application cover letter.

Candidate Name: ${userName}
Tech Stack: React, Node.js, Express, MongoDB, TypeScript

Job Description:
${jobDescription}

Write a professional cover letter following these rules:
- Maximum 3 paragraphs
- First paragraph: express interest and mention 1-2 relevant skills
- Second paragraph: highlight relevant experience and projects
- Third paragraph: express enthusiasm and call to action
- Professional but not robotic tone
- Do NOT include placeholder text like [Company Name] or [Your Name]
- Do NOT include date or address headers
- Start directly with "Dear Hiring Manager,"
- End with "Sincerely, ${userName}"
- Keep it under 250 words
`

  // 4. Call Groq API
  const groq = getGroqClient()

const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  model: "llama-3.3-70b-versatile",
  temperature: 0.2
})

const coverLetter =
  completion.choices[0]?.message?.content || ""

// 5. Cache for 24 hours
await setCache(cacheKey, coverLetter, AI_CACHE_TTL)

return coverLetter
}

// ─── Analyze Resume Match ─────────────────────────────────
export const analyzeResumeMatch = async (
  jobDescription: string,
  userSkills: string
): Promise<{
  matchScore: number
  missingSkills: string[]
  presentSkills: string[]
  suggestions: string[]
}> => {

  const hash = createHash(jobDescription + userSkills)
  const cacheKey = `ai:match:${hash}`

  const cached = await getCache<{
    matchScore: number
    missingSkills: string[]
    presentSkills: string[]
    suggestions: string[]
  }>(cacheKey)

  if (cached) {
    console.log("📦 Cache hit: resume match")
    return cached
  }

  console.log("🤖 Analyzing resume match with Groq...")

  const prompt = `
You are an expert technical recruiter analyzing a candidate's 
profile against a job description.

Candidate's Current Skills:
${userSkills}

Job Description:
${jobDescription}

Analyze the match and respond with ONLY a valid JSON object 
in this exact format (no markdown, no backticks, just raw JSON):
{
  "matchScore": <number between 0-100>,
  "presentSkills": [<skills candidate has that job requires>],
  "missingSkills": [<skills job requires but candidate lacks>],
  "suggestions": [<3 specific actionable suggestions to improve match>]
}
`

const groq = getGroqClient()

const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  model: "llama-3.3-70b-versatile",
  temperature: 0.2
})

const responseText =
  completion.choices[0]?.message?.content || ""

// Parse JSON response
// Clean any markdown formatting if AI adds it
const cleanJson = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

const analysis = JSON.parse(cleanJson)

await setCache(cacheKey, analysis, AI_CACHE_TTL)

return analysis
}

// ─── Generate Interview Questions ─────────────────────────
export const generateInterviewQuestions = async (
  jobDescription: string,
  role: string
): Promise<{
  technical: string[]
  behavioral: string[]
  roleSpecific: string[]
}> => {

  const hash = createHash(jobDescription + role)
  const cacheKey = `ai:interview:${hash}`

  const cached = await getCache<{
    technical: string[]
    behavioral: string[]
    roleSpecific: string[]
  }>(cacheKey)

  if (cached) {
    console.log("📦 Cache hit: interview questions")
    return cached
  }

  console.log("🤖 Generating interview questions with Groq...")

  const prompt = `
You are an expert technical interviewer preparing a candidate 
for a ${role} position.

Job Description:
${jobDescription}

Generate interview questions and respond with ONLY a valid JSON 
object in this exact format (no markdown, no backticks, just raw JSON):
{
  "technical": [<5 technical questions specific to the tech stack>],
  "behavioral": [<3 behavioral questions using STAR format>],
  "roleSpecific": [<3 questions specific to this role and company>]
}

Make questions realistic and specific — not generic.
`

const groq = getGroqClient()

const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  model: "llama-3.3-70b-versatile",
  temperature: 0.2
})

const responseText =
  completion.choices[0]?.message?.content || ""

const cleanJson = responseText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

const questions = JSON.parse(cleanJson)

await setCache(cacheKey, questions, AI_CACHE_TTL)

return questions
}