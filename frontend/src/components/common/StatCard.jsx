import { motion } from "framer-motion"
import AnimatedNumber from "../motion/AnimatedNumber"
import { staggerItem } from "../motion/Stagger"

// `numericValue` (+ `format`) active le compteur animé ; sinon `value` est affiché tel quel.
export default function StatCard({ title, value, numericValue, format, subtitle, icon: Icon, color = "blue", trend, trendLabel }) {
  const colors = {
    blue:   "bg-blue-50   text-blue-700   border-blue-200",
    green:  "bg-green-50  text-green-700  border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red:    "bg-red-50    text-red-700    border-red-200",
    teal:   "bg-teal-50   text-teal-700   border-teal-200",
  }[color]
  return (
    <motion.div variants={staggerItem} className={`stat-card border ${colors}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-gray-900 truncate" title={typeof value === "string" ? value : undefined}>{numericValue !== undefined ? <AnimatedNumber value={numericValue} format={format} /> : value}</p>
        <p className="text-sm text-gray-600 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-xs font-semibold mt-1 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </div>
    </motion.div>
  )
}