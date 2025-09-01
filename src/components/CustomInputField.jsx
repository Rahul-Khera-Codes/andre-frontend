import { Search } from 'lucide-react'
import React from 'react'

function CustomInputField({ placeholder, search, setSearch, extraStyles }) {
    return (
        <div className={`relative ${extraStyles}`}>
            <input
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 border-1 border-gray-200 bg-gray-50 focus:border-[#36509A] focus:bg-white focus:outline-none  rounded-xl w-full py-3 text-sm transition-all duration-200"
            />
            <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-[#36509A] to-[#6C99EE] p-1.5 rounded-lg">
                <Search className="text-white w-4 h-4" />
            </div>
        </div>
    )
}

export default CustomInputField
