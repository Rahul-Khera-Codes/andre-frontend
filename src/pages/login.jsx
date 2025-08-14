import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useGoogleLogin } from "@react-oauth/google"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState("")


  const validateForm = () => {
    const newErrors = {};
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    if (formData.email === '') {
      newErrors.email = "Email is required"
    } else {
      if (!validateEmail(formData.email)) newErrors.email = "Invalid email format"
    }
    if (formData.password === '') newErrors.password = "Password is required"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess("")
    if (!validateForm()) {
      return
    }
    setIsLoading(true)

    setTimeout(() => {
      if (formData.email === "admin@biotech.com" && formData.password === "password") {
        setSuccess("successfully Loginned.")
        navigate("/")
      } else {
        setErrors({ email: "Invalid email", password: "Invalid password" })
        // setErrors("Invalid email or password. Please try again.")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleGoogleLogin = async (auth_data) => {
    console.log(auth_data, auth_data?.credential, "response")
    const token = auth_data?.access_token
    console.log(token, "jooo")
  }

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleLogin,
  });

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 h-full">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Biotech Operations</h1>
            <p className="text-slate-600">Sign in to your secure dashboard</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold pb-2">Welcome Back</h2>
            <p className="text-sm text-slate-600">Enter your credentials to access your account</p>
          </div>
          {Object.values(errors).some(Boolean) && (
            <div className="flex items-start gap-2 p-3 bg-red-800 border border-red-200 rounded text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5" color="white" />
              <span className="text-white">
                Please fix the errors below
              </span>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded text-sm">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="email"
                  type="text"
                  placeholder="you@biotech.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-200  rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              {errors?.email && <p className="text-red-500 py-2 text-sm">{errors?.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors?.password && <p className="text-red-500 py-2 text-sm">{errors?.password}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="form-checkbox"
                  style={{ accentColor: "green" }}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-800 cursor-pointer hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-800 cursor-pointer text-white rounded-md hover:bg-green-900 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="w-full flex items-center gap-2">
            <hr style={{ color: "lightgrey", width:"48%" }} />
            or
            <hr style={{ color: "lightgrey", width:"48%" }} />
          </div>
          <button onClick={() => loginGoogle()} className="w-full flex cursor-pointer items-center font-[600] text-[#5A687C] text-[14px] justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
            <FcGoogle className="mr-2 text-xl" /> Continue with Google
          </button>
          <div className="border-t border-gray-300 pt-4 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-800 cursor-pointer font-medium hover:underline"
            >
              Register Here
            </button>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Enterprise Security</h4>
            <p className="text-sm text-green-700">
              Your data is protected with enterprise-grade encryption and security protocols. All activities are logged
              for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
