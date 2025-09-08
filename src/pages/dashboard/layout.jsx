import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronsRightIcon } from 'lucide-react'
import { authMicroSoftDetails } from '../../apis/auth'
import { useDispatch } from 'react-redux'
import { getProfileData, profileFetchedFailed } from '../../store/profileSlice'
import Loader from '../../components/loader'
import { getLoginStatusMsg } from '../../store/loginStatusMsgSlice'

function Dashboard() {
    const [openSidebar, setOpenSidebar] = useState(true)
    const [showSidebar, setShowSidebar] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const path = useLocation();
    const searchParams = new URLSearchParams(path.search);
    const query_msg = searchParams.get('response');
    const user_id = searchParams.get('mid');
    const token = localStorage.getItem("token")
    const mId = localStorage.getItem("mid")


    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        setOpenSidebar(!openSidebar)
    }
    const fetchMicrosoftDetails = async (id) => {
        console.log(id)
        try {
            const response = await authMicroSoftDetails(id);
            console.log(response?.data, "kjhgfszdx")
            if (response?.status === 200) {
                localStorage.setItem("token", response?.data?.access_token)
                localStorage.setItem("refreshToken", response?.data?.refresh_token)
                localStorage.setItem("mid", response?.data?.microsoft_id)
                dispatch(getProfileData(response?.data))
            } else {
                console.log(response)
                dispatch(getLoginStatusMsg(response?.response?.data?.message))
                dispatch(profileFetchedFailed(response?.response?.data?.message || response?.message))
                navigate("/")
                localStorage.clear()
            }

        } catch (error) {
            dispatch(getLoginStatusMsg("Network Connection"))
            dispatch(profileFetchedFailed("Network Connection"))
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (user_id ?? mId) {
            if (user_id) {
                localStorage.setItem("mid", user_id)
                fetchMicrosoftDetails(user_id)
            } else {
                fetchMicrosoftDetails(mId)
            }
        } else {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 756 && showSidebar) {
                setShowSidebar(true);
            } else {
                setShowSidebar(false);
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (loading) return <Loader />

    return (
        <div className='h-full w-full'>
            <div className='h-18 w-full'><Navbar setShowSidebar={setShowSidebar} /></div>
            <div className='h-[calc(100%-72px)] w-full flex'>
                <div className={`${openSidebar ? 'w-65' : 'w-20'} relative  h-full hidden md:flex`}><Sidebar openSidebar={openSidebar} showSidebar={showSidebar} />
                    {!showSidebar && <div className={`absolute right-[-18px] group cursor-pointer transition-transform duration-200 ${openSidebar ? "rotate-180" : "rotate-0"
                        }`} onClick={handleClose}><div className="flex items-center gap-2"><div className='group-hover:hidden bg-[#93a7d7] rounded-full'><ChevronsRightIcon color='lightgray' /></div> <div className='hidden group-hover:block bg-[#425990] rounded-full'> <ChevronsRightIcon color='white' /></div></div></div>}
                </div>
                <div className={`${openSidebar ? 'w-full md:w-[calc(100%-260px)]' : 'w-full md:w-[calc(100%-80px)]'} h-full bg-[#f3fafa]`}><Outlet /></div>
            </div>
            {showSidebar && <div className="fixed w-full inset-0 bg-black/40 z-50 md:hidden block">
                <Sidebar openSidebar={openSidebar} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            </div>}
        </div>
    )
}

export default Dashboard
