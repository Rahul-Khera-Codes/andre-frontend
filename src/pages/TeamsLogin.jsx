import { useEffect, useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { BsMicrosoftTeams } from "react-icons/bs"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const TeamsLogin = () => {
    const path = useLocation();
    const query = new URLSearchParams(path.search);
    const query_msg = query.get('response');
    const [error, setError] = useState("");
    const msg = useSelector((state) => state.loginStatusMsg.msg)

    useEffect(() => {
        if (query_msg === "error") {
            setError("Logined Failed")
        }
    }, [query_msg])



    const handleMicrosoftLogin = async () => {
        setError("")
        const path = import.meta.env.VITE_OAUTH_MICROSOFT_URL
        window.open(path)
    }

    return (
        <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 h-full">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                        {/* <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div> */}
                        <div className="w-80">
                            <img src="./logo.png" alt="logo" className="object-cover"/>
                        </div>
                    </div>
                    <div>
                        {/* <h1 className="text-2xl font-serif font-bold text-slate-900">Biotech Operations</h1> */}
                        <p className="text-slate-600">Sign in to your secure dashboard</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold pb-2">Welcome Back</h2>
                    </div>
                    {(error || msg) && (
                        <div className="flex items-start gap-2 p-3 bg-red-800 border border-red-200 rounded text-sm">
                            <AlertTriangle className="w-4 h-4 mt-0.5" color="white" />
                            <span className="text-white">
                                {error ?? msg}
                            </span>
                        </div>
                    )}
                    <button onClick={handleMicrosoftLogin} className="w-full flex cursor-pointer items-center font-[600] text-[#5A687C] text-[14px] justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                        <BsMicrosoftTeams className="mr-2 text-xl" color="#5159C3" /> Continue with Microsoft Teams
                    </button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-8 h-8 text-[#374A8C] mt-0.5" />
                    <div>
                        <h4 className="font-bold text-[#374A8C] mb-1">Enterprise Security</h4>
                        <p className="text-sm text-[#58585b]">
                            Your data is protected with enterprise-grade encryption and security protocols. All activities are logged
                            for compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamsLogin
