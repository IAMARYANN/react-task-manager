import { useState, useEffect } from 'react'
import axios from 'axios'

// Custom hook for generic API fetches
// Usage: const { data, loading, error, refetch } = useFetch('/todos/1')

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    if (!url) return
    let cancelled = false

    setLoading(true)
    setError(null)

    axios
      .get(`https://jsonplaceholder.typicode.com${url}`)
      .then(res => {
        if (!cancelled) setData(res.data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [url, trigger])

  const refetch = () => setTrigger(n => n + 1)

  return { data, loading, error, refetch }
}

export default useFetch
