import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string      // label above input
  error?: string      // error message below input
  helperText?: string // helper text below input
}

// forwardRef lets parent components access the input DOM element directly
// Required by React Hook Form to work properly
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = "",
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* Input field */}
      <input
        ref={ref}   // React Hook Form needs this ref to control the input
        className={`
          input-field
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

// Display name for React DevTools debugging
Input.displayName = "Input"

export default Input