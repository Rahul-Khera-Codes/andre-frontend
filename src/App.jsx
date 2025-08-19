import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/layout'
import Home from './pages/dashboard/Home'
import TaskManagement from './pages/dashboard/taskmanagement'
import AIDraftReview from './pages/dashboard/AIdraft'
import Settings from './pages/dashboard/Settings'
import CalendarManagement from './pages/dashboard/CalendarIntegration'
import Chat from './pages/dashboard/Chat'
import TeamsLogin from './pages/TeamsLogin'

function App() {

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/' element={<TeamsLogin />} />
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
