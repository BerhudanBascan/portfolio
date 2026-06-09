import { useState, useEffect } from 'react'

/**
 * Returns true if the window width is below the given breakpoint (px).
 * Safe for SSR: initialises to false on the server.
 */
export function useBreakpoint(maxWidth: number): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < maxWidth : false
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [maxWidth])

  return matches
}

/**
 * Returns true when the primary pointing device is coarse (touch) OR
 * the viewport is narrow. Useful for deciding hover vs tap interactions.
 */
export function useIsTouch(maxWidth = 1024): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < maxWidth
  })

  useEffect(() => {
    const coarseMq = window.matchMedia('(pointer: coarse)')
    const widthMq = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    const update = () => setIsTouch(coarseMq.matches || widthMq.matches)
    update()
    coarseMq.addEventListener('change', update)
    widthMq.addEventListener('change', update)
    return () => {
      coarseMq.removeEventListener('change', update)
      widthMq.removeEventListener('change', update)
    }
  }, [maxWidth])

  return isTouch
}
