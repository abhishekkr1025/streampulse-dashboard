import { useState, useEffect } from "react"

export function usePolling(url, interval = 5000) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetch_ = async () => {
      try {
        const res  = await fetch(url)
        const json = await res.json()
        if (!cancelled) { setData(json); setLoading(false) }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    }
    fetch_()
    const id = setInterval(fetch_, interval)
    return () => { cancelled = true; clearInterval(id) }
  }, [url, interval])

  return { data, loading, error }
}