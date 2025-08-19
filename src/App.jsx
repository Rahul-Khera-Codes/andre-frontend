import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Register from './pages/register'
import ForgotPassword from './pages/forgotpassword'
import ResetPassword from './pages/resetpassword'
import Dashboard from './pages/dashboard/layout'
import Home from './pages/dashboard/Home'
import TaskManagement from './pages/dashboard/taskmanagement'
import AIDraftReview from './pages/dashboard/AIdraft'
import Settings from './pages/dashboard/Settings'
import CalendarManagement from './pages/dashboard/CalendarIntegration'
import Chat from './pages/dashboard/Chat'

function App() {

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='' element={<Home />} />
          <Route path='task-management' element={<TaskManagement />} />
          <Route path='ai-draft' element={<AIDraftReview />} />
          <Route path='settings' element={<Settings />} />
          <Route path='calendar-management' element={<CalendarManagement />} />
          <Route path='chat' element={<Chat />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
