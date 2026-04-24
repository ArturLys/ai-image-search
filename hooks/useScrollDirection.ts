'use client'
import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      setHidden(window.scrollY > lastY && window.scrollY > 50)
      lastY = window.scrollY
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden
}
