import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronsRightIcon } from 'lucide-react'
import { authMicroSoftDetails } from '../../apis/auth'
import { useDispatch } from 'react-redux'
import { getProfileData } from '../../store/profileSlice'
import Loader from '../../components/loader'

function Dashboard() {
    const [openSidebar, setOpenSidebar] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const path = useLocation();
    const searchParams = new URLSearchParams(path.search);
    const query_msg = searchParams.get('response');
    const user_id = searchParams.get('mid');
    const handleClose = () => {
        setOpenSidebar(!openSidebar)
    }
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token")
    const mId = localStorage.getItem("userId")

    const fetchMicrosoftDetails = async (id) => {
        try {
            const response = await authMicroSoftDetails(id);
            if (response?.status === 200) {
                dispatch(getProfileData(response?.data?.connected_accounts))
            } else {
                // navigate("/")
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (query_msg === "success" || token) {
            if (user_id) {
                localStorage.setItem("userId", user_id)
                fetchMicrosoftDetails(user_id)
            } else {
                fetchMicrosoftDetails(mId)
            }
        } else {
            //navigate("/")
        }
        fetchMicrosoftDetails(mId)
    }, [query_msg, token])

    if (loading) return <Loader />

    return (
        <div className='h-full w-full'>
            <div className='h-20 w-full'><Navbar /></div>
            <div className='h-[calc(100%-80px)] w-full flex'>
                <div className={`${openSidebar ? 'w-74' : 'w-20'} relative h-full flex`}><Sidebar openSidebar={openSidebar} />
                    <div className={`absolute right-[-18px] group cursor-pointer transition-transform duration-200 ${openSidebar ? "rotate-180" : "rotate-0"
                        }`} onClick={handleClose}><div className="flex items-center gap-2"><div className='group-hover:hidden'><ChevronsRightIcon color='lightgray' /></div> <div className='hidden group-hover:block'> <ChevronsRightIcon /></div></div></div>
                </div>
                <div className={`${openSidebar ? 'w-[calc(100%-296px)]' : 'w-[calc(100%-80px)]'} h-full`}><Outlet /></div>
            </div>
        </div>
    )
}

export default Dashboard
