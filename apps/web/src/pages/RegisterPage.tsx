import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import useAuthStore from "@/store/authStore"
import { registerSchema, RegisterInput } from "@/validations/auth.validation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const RegisterPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user, data.token)
      navigate("/dashboard")
    }
  })

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 mt-2">
            Start tracking your job applications
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Full Name"
              type="text"
              placeholder="Amith Krishnan"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="Minimum 6 characters"
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* API Error */}
            {registerMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {(registerMutation.error as any)?.response?.data?.message
                    || "Registration failed. Please try again."}
                </p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage