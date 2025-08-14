import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
    return (
        <div className='h-full w-full'>
            <div className='h-20 w-full'><Navbar /></div>
            <div className='h-[calc(100%-80px)] w-full flex'>
                <div className='w-74 h-full'><Sidebar /></div>
                <div className='w-[calc(100%-296px)] h-full'><Outlet /> klj</div>
            </div>
        </div>
    )
}

export default Dashboard
