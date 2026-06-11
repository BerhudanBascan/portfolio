import { useRef, ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const threshold = Math.max(rect.width, rect.height) / 2 + padding

    if (dist < threshold) {
      if (!activeRef.current) {
        activeRef.current = true
        ref.current.style.transition = activeTransition
      }
      ref.current.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`
    } else if (activeRef.current) {
      activeRef.current = false
      ref.current.style.transition = inactiveTransition
      ref.current.style.transform = 'translate3d(0px, 0px, 0)'
    }
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    activeRef.current = false
    ref.current.style.transition = inactiveTransition
    ref.current.style.transform = 'translate3d(0px, 0px, 0)'
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}