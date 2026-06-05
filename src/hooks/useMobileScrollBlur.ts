import { useEffect, useRef } from 'react'

export function useMobileScrollBlur(listSelector: string, itemSelector: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const isMobile = !window.matchMedia('(hover: hover)').matches
    if (!isMobile) return

    const list = document.querySelector(listSelector) as HTMLElement | null
    if (!list) return

    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      const items = Array.from(list.querySelectorAll(itemSelector)) as HTMLElement[]
      if (!items.length) return

      const focusItem = (target: Element) => {
        list.classList.add('scroll-blur-active')
        items.forEach(el => el.classList.remove('scroll-focused'))
        target.classList.add('scroll-focused')
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          list.classList.remove('scroll-blur-active')
          items.forEach(el => el.classList.remove('scroll-focused'))
        }, 1200)
      }

      const obs = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter(e => e.isIntersecting)
          if (!visible.length) return
          const best = visible.reduce((a, b) => a.intersectionRatio >= b.intersectionRatio ? a : b)
          focusItem(best.target)
        },
        { rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      )

      items.forEach(el => obs.observe(el))
      observerRef.current = obs
    }

    setupObserver()

    const mut = new MutationObserver(() => {
      setupObserver()
    })
    mut.observe(list, { childList: true, subtree: true })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
      mut.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [listSelector, itemSelector])
}
