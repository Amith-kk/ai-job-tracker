import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"

//  Validate Middleware Factory 
// Takes a Zod schema and returns an Express middleware
// This is a HOF — Higher Order Function
// It's a function that RETURNS a function
const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body, params, and query against schema
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query
      })
      // Data is valid — pass to next middleware/controller
      next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Format Zod errors into clean array
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
        res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors
        })
        return
      }
      // Unknown error
      res.status(500).json({
        success: false,
        message: "Internal server error"
      })
    }
  }
}

export default validate