import User, { IUser } from "../models/User.model"
import { generateToken } from "../utils/jwt.utils"
import { RegisterPayload, AuthResponse } from "@repo/types"

// ─── Register Service ─────────────────────────────────────
export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const { name, email, password } = data

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // 2. Create user — password hashed automatically by pre-save hook
  const user = await User.create({ name, email, password })

  // 3. Generate JWT token
  const token = generateToken(user._id.toString())

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}

// ─── Login Service ────────────────────────────────────────
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // 1. Find user — explicitly select password (hidden by default)
  const user = await User.findOne({ email }).select("+password") as IUser | null

  if (!user) {
    // IMPORTANT: Same error message for wrong email OR wrong password
    // Never tell attackers which one is wrong — security best practice
    throw new Error("Invalid email or password")
  }

  // 2. Compare password
  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  // 3. Generate token
  const token = generateToken(user._id.toString())

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}