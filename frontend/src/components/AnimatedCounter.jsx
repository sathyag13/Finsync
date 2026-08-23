import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function AnimatedCounter({
  value = 0,
  prefix = '₹',
  decimals = 0,
  className = '',
  style = {}
}) {
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  })

  useEffect(() => {
    spring.set(Number(value) || 0)
  }, [value, spring])

  const display = useTransform(spring, (current) => {
    const formatted = Math.round(current).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    return `${prefix}${formatted}`
  })

  return <motion.span className={className} style={style}>{display}</motion.span>
}
