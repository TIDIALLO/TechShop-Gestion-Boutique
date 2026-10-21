import { motion } from "framer-motion"

const container = (delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

// Les enfants <StaggerItem> apparaissent l'un après l'autre.
export function StaggerGroup({ children, className, delay = 0.06, as = "div" }) {
  const Tag = motion[as]
  return (
    <Tag variants={container(delay)} initial="hidden" animate="show" className={className}>
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className, as = "div" }) {
  const Tag = motion[as]
  return <Tag variants={staggerItem} className={className}>{children}</Tag>
}
