import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
    User,
} from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useGoogleLogin } from "@react-oauth/google"
import { authRegister } from "../apis/auth"

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /\S+@\S+\.\S+/

        if (!formData.username.trim()) newErrors.username = "User name is required"

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess("")
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                email: formData.email
            }
            const response = await authRegister(payload);
            console.log(response)
            if (response?.status === 200) {
                navigate("/")
            } else {
                setIsLoading(false)
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    const handleGoogleRegister = async (auth_data) => {
        console.log(auth_data, auth_data?.credential, "response")
        const token = auth_data?.access_token
        console.log(token, "jooo")
    }

    const registerGoogle = useGoogleLogin({
        onSuccess: handleGoogleRegister,
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
                        <h1 className="text-2xl font-serif font-bold text-slate-900">
                            Biotech Operations
                        </h1>
                        <p className="text-slate-600">Create your secure account</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold pb-2">Create Account</h2>
                        <p className="text-sm text-slate-600">
                            Fill in your details below
                        </p>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">User Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                    placeholder="John"
                                    className="w-full pl-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            {errors?.username && <p className="text-red-500 py-2 text-sm">{errors?.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="you@biotech.com"
                                    className="w-full pl-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            {errors?.email && <p className="text-red-500 py-2 text-sm">{errors?.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Password"
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Confirm password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors?.confirmPassword && <p className="text-red-500 py-2 text-sm">{errors?.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 cursor-pointer bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Create Account"}
                        </button>
                    </form>

                    <div className="w-full flex items-center gap-2">
                        <hr style={{ color: "lightgrey", width: "48%" }} />
                        or
                        <hr style={{ color: "lightgrey", width: "48%" }} />
                    </div>
                    <button onClick={() => registerGoogle()} className="w-full flex cursor-pointer items-center font-[600] text-[#5A687C] text-[14px] justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                        <FcGoogle className="mr-2 text-xl" /> Continue with Google
                    </button>

                    <div className="border-t border-gray-300 pt-4 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/")}
                            className="text-green-800 cursor-pointer font-medium hover:underline"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-green-900 mb-1">Your Information is Secure</h4>
                        <p className="text-sm text-green-700">
                            We protect your data using enterprise-grade encryption and security protocols.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
