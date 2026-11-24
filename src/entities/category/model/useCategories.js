import { useEffect, useState } from 'react'
import { getCategories } from 'shared/api'

export const useCategories = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let cancelled = false

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return categories
}
