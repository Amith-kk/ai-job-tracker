import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import useAuthStore from "@/store/authStore"
import { loginSchema, LoginInput } from "@/validations/auth.validation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  // ─── React Hook Form Setup ────────────────────────────
  // zodResolver connects Zod schema to React Hook Form
  // Every field is validated against loginSchema automatically
  const {
    register,    // connects input to form
    handleSubmit, // wraps your submit handler with validation
    formState: { errors }  // contains validation errors per field
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  })

  // ─── Login Mutation ───────────────────────────────────
  // useMutation is React Query's way of handling POST/PUT/DELETE
  // Unlike useQuery (for GET), useMutation is triggered manually
  const loginMutation = useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      // Store user and token in Zustand
      // Axios interceptor will now add token to all requests
      login(data.user, data.token)
      // Navigate to dashboard
      navigate("/dashboard")
    },

    onError: (error: any) => {
      // Error is handled in JSX below
      console.error("Login failed:", error)
    }
  })

  // ─── Form Submit Handler ──────────────────────────────
  // handleSubmit runs Zod validation first
  // If valid → calls onSubmit with clean data
  // If invalid → sets errors, onSubmit never called
  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to your job tracker
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email Field */}
            {/* register("email") connects this input to React Hook Form */}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* API Error Message */}
            {/* Shows when login fails — wrong credentials etc */}
            {loginMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {(loginMutation.error as any)?.response?.data?.message
                    || "Login failed. Please try again."}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>

          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage