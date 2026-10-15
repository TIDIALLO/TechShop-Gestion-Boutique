export default function Badge({ label, color = "gray", size = "sm" }) {
  const colors = {
    gray:   "bg-gray-100 text-gray-700",
    blue:   "bg-blue-100 text-blue-800",
    green:  "bg-green-100 text-green-800",
    red:    "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    purple: "bg-purple-100 text-purple-800",
    teal:   "bg-teal-100 text-teal-800",
  }[color] || "bg-gray-100 text-gray-700"
  return (
    <span className={`badge ${colors} ${size === "lg" ? "text-sm px-3 py-1" : ""}`}>{label}</span>
  )
}