import ProfileDropdown from "./profiledropdown"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown";
import logo from '../assets/logo.png'
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar({ setShowSidebar }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b h-full border-slate-200 bg-gradient-to-r from-[#d5dbef] to-[#e6e6e9] px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:space-x-4 space-x-2">
          <div className="md:hidden block cursor-pointer" onClick={() => setShowSidebar(true)}><GiHamburgerMenu /></div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-45">
              <img src={logo} alt="logo" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="flex items-center md:space-x-4 pt-2 space-x-1">
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default Navbar