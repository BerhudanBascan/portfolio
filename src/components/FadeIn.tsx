import { motion } from 'framer-motion'
import { ReactNode, ElementType, CSSProperties, useMemo } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: ElementType
}

const motionElements: Record<string, any> = {
  div: motion.div,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  as = 'div',
}: FadeInProps) {
  const MotionComponent = useMemo(() => {
    if (typeof as === 'string' && motionElements[as]) {
      return motionElements[as]
    }
    return motion.create(as as ElementType)
  }, [as])

  return (
    <MotionComponent
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionComponent>
  )
}