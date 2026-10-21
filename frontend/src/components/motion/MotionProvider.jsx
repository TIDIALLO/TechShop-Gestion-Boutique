import { MotionConfig } from "framer-motion"

// reducedMotion="user" : respecte le réglage « réduire les animations » de l'OS.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
