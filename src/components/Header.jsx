import { Plus } from 'lucide-react'

function Header({ header, description, buttonStatus = false, handler }) {
    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-[#6e80b6] to-[#9fb4f2] p-6 rounded-2xl text-white shadow-lg">
            <div>
                <h1 className="text-3xl font-serif font-bold">{header}</h1>
                <p className="text-purple-100 mt-1">
                    {description}</p>
            </div>
            {buttonStatus && <button
                onClick={() => handler(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-[#374A8C] to-[#374A8C] cursor-pointer text-white rounded-xl hover:from-[#5876df] hover:to-[#708ae8] shadow-lg transform hover:scale-105 transition-all duration-200"
            >
                <Plus className="w-5 h-5 mr-2" /> New Reminder
            </button>}
        </div>
    )
}

export default Header
