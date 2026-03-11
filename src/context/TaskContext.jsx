import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const TaskContext = createContext(null)
const ThemeContext = createContext(null)

const BASE = 'https://jsonplaceholder.typicode.com'

const STORAGE_KEY = 'taskmanager_tasks'

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // ignore
  }
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('tm_theme') || 'dark')

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('tm_theme', next)
      return next
    })
  }

  // fetch on mount
  useEffect(() => {
    const cached = loadFromStorage()
    if (cached && cached.length > 0) {
      setTasks(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    axios
      .get(`${BASE}/todos?_limit=20`)
      .then(res => {
        // add priority + due date defaults for bonus
        const enriched = res.data.map(t => ({
          ...t,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          dueDate: '',
          description: '',
        }))
        setTasks(enriched)
        saveToStorage(enriched)
      })
      .catch(() => {
        setError('Failed to fetch tasks. Check your connection and try again.')
      })
      .finally(() => setLoading(false))
  }, [])

  // sync to storage on changes
  useEffect(() => {
    if (tasks.length > 0) saveToStorage(tasks)
  }, [tasks])

  const addTask = useCallback(async (taskData) => {
    const res = await axios.post(`${BASE}/todos`, {
      title: taskData.title,
      completed: false,
      userId: 1,
    })
    // mock api returns id 201 always - generate a local unique id
    const newTask = {
      ...res.data,
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      completed: false,
    }
    setTasks(prev => [newTask, ...prev])
    return newTask
  }, [])

  const toggleTask = useCallback(async (id) => {
    // optimistic
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
    try {
      const task = tasks.find(t => t.id === id)
      await axios.patch(`${BASE}/todos/${id}`, { completed: !task?.completed })
    } catch {
      // revert on failure
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      )
    }
  }, [tasks])

  const deleteTask = useCallback(async (id) => {
    await axios.delete(`${BASE}/todos/${id}`)
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTask = useCallback(async (id, updates) => {
    await axios.put(`${BASE}/todos/${id}`, updates)
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    )
  }, [])

  const getTask = useCallback((id) => {
    return tasks.find(t => t.id === Number(id))
  }, [tasks])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <TaskContext.Provider value={{ tasks, loading, error, addTask, toggleTask, deleteTask, updateTask, getTask }}>
        {children}
      </TaskContext.Provider>
    </ThemeContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be inside TaskProvider')
  return ctx
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside TaskProvider')
  return ctx
}
