import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt.utils"
import User from "../models/User.model"

//  Extend Express Request Type 
// By default req.user doesn't exist in Express
// We tell TypeScript "trust me, req.user will exist after this middleware"
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        name: string
        email: string
      }
    }
  }
}

//  Auth Middleware 
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Check if Authorization header exists
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Not authorized — no token provided"
      })
      return
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1]

    // 3. Verify token
    const decoded = verifyToken(token)

    // 4. Find user from token payload
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Not authorized — user not found"
      })
      return
    }

    // 5. Attach user to request — available in all downstream controllers
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized — invalid token"
    })
  }
}