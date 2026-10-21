import { useEffect, useRef } from "react"
import { animate, useReducedMotion } from "framer-motion"

// Compteur animé : `format` transforme le nombre courant en texte (ex. formatCurrency).
export default function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString("fr-FR"), duration = 0.9 }) {
  const ref = useRef(null)
  const previous = useRef(0)
  const reduce = useReducedMotion()
  const target = Number(value) || 0

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (reduce) {
      node.textContent = format(target)
      previous.current = target
      return undefined
    }
    const controls = animate(previous.current, target, {
      duration,
      ease: "easeOut",
      onUpdate: (n) => { node.textContent = format(n) },
    })
    previous.current = target
    return () => controls.stop()
  }, [target, duration, reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{format(target)}</span>
}
