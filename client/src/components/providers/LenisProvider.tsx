'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    const scheduleResize = () => {
      requestAnimationFrame(() => {
        lenis.start()
        lenis.resize()
      })
    }

    const handlePageShow = () => {
      scheduleResize()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        scheduleResize()
      }
    }

    const observer = new MutationObserver(scheduleResize)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    })

    window.addEventListener('resize', scheduleResize)
    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleResize)
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelAnimationFrame(rafId)
      lenisRef.current = null
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    // Re-sync scroll engine after route transitions and browser back/forward navigation.
    requestAnimationFrame(() => {
      if (!lenisRef.current) return
      lenisRef.current.start()
      lenisRef.current.resize()
    })
  }, [pathname])

  return <>{children}</>
}

export default LenisProvider
