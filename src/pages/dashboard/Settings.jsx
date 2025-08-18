import {
    Key,
    EyeOff,
    Eye,
    Lock,
    AlertTriangle,
} from "lucide-react"
import React, { useState } from "react"
import { authPasswordChange } from "../../apis/auth";

function Settings() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState({ current: false, new: false, confirm: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
        setErrors((prev) => ({
            ...prev, [name]: ""
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current Password is required"
        }
        if (!formData.newPassword) {
            newErrors.newPassword = "New Password is required"
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "New Password must be at least 6 characters"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "New Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess("")
        setErrors({})
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const payload = {
                old_password: formData.currentPassword,
                new_password: formData.newPassword
            }
            const response = await authPasswordChange(payload);
            if (response?.status === 200) {
                setSuccess(response?.data?.message)
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                setTimeout(() => {
                    setSuccess("")
                }, [3000])
            } else {
                setErrors((prev) => ({ ...prev, detail: response?.response?.data?.detail }))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const inputDetails = ["current", "new", "confirm"]

    return (
        <div className="space-y-6 h-full w-full p-3 overflow-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Security & Privacy</h1>
                    <p className="text-slate-600 mt-1">Manage your account security and privacy settings</p>
                </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-6">
                    <div className="border border-gray-300 rounded-xl p-6 shadow-sm space-y-6">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Key className="w-5 h-5" /> Password & Authentication
                        </h2>
                        {Object.values(errors).some(Boolean) && (
                            <div className="flex items-start gap-2 p-3 bg-red-800 border border-red-200 rounded text-sm">
                                <AlertTriangle className="w-4 h-4 mt-0.5" color="white" />
                                <span className="text-white">
                                    {errors?.detail ?? 'Please fix the errors below'}
                                </span>
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded text-sm">
                                {success}
                            </div>
                        )}
                        <div className="space-y-4">
                            {inputDetails.map((each) => (
                                <React.Fragment key={each}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {each[0].toUpperCase() + each.slice(1)} Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            id={each}
                                            type={passwordVisible?.[each] ? "text" : "password"}
                                            placeholder={`Enter your ${each} password`}
                                            value={formData[`${each}Password`]}
                                            name={`${each}Password`}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible((prev) => ({ ...prev, [each]: !prev[each] }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {passwordVisible?.[each] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors?.[`${each}Password`] && <p className="text-red-500 text-sm">{errors?.[`${each}Password`]}</p>}
                                </React.Fragment>
                            ))}
                            <button disabled={isLoading} className={`px-4 py-2 disabled:cursor-not-allowed disabled:bg-green-900 bg-green-800 cursor-pointer text-white rounded-lg`} onClick={handleSubmit}>{isLoading ? 'Updating...' : 'Update Password'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
