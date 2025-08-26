import { Bell, Search, Settings } from "lucide-react"
import ProfileDropdown from "./profiledropdown"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b h-full border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-serif font-bold text-slate-900">
              Biotech Operations
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks, emails, documents..."
              className="pl-10 pr-4 py-1.5 border border-slate-300 rounded-lg w-80 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div> */}
          {/* <button className="relative w-8 h-8 flex items-center justify-center rounded-md transition">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-800 rounded-full"></span>
          </button> */}
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default Navbar