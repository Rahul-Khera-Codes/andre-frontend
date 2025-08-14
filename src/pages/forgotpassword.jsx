import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Mail, AlertTriangle } from "lucide-react"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Invalid email format")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      // Simulate API success
      setSuccess("A password reset link has been sent to your email.")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 h-full">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Biotech Operations
            </h1>
            <p className="text-slate-600">Reset your account password</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold pb-2">Forgot Password</h2>
            <p className="text-sm text-slate-600">
              Enter your email to receive a reset link
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-800 border border-red-200 rounded text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5" color="white" />
              <span className="text-white">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="email"
                  type="text"
                  placeholder="you@biotech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 cursor-pointer bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="border-t border-gray-300 pt-4 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-green-800 cursor-pointer font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Password Security</h4>
            <p className="text-sm text-green-700">
              For your protection, we never store plain-text passwords. Use a secure password manager to keep your credentials safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
