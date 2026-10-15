export const formatCurrency = (amount, currency = "FCFA") =>
  `${Number(amount || 0).toLocaleString("fr-FR")} ${currency}`

export const formatDate = (dateStr, opts = {}) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric", ...opts
  })

export const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  })

export const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return "À l instant"
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`
  return formatDate(dateStr)
}

export const formatPercent = (val) => `${Number(val || 0).toFixed(1)}%`

export const truncate = (str, max = 50) =>
  str && str.length > max ? str.slice(0, max) + "…" : str
