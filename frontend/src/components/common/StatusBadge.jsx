import { SALE_STATUS } from "../../utils/constants"
export default function StatusBadge({ status }) {
  const cfg = SALE_STATUS[status] || { label: status, color: "bg-gray-100 text-gray-700" }
  return <span className={`badge ${cfg.color}`}>{cfg.label}</span>
}