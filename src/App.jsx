import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import TaskList from './pages/TaskList'
import TaskDetail from './pages/TaskDetail'
import { useTheme } from './context/TaskContext'

function App() {
  const { theme } = useTheme()

  return (
    <div data-theme={theme} style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px 60px' }}>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
