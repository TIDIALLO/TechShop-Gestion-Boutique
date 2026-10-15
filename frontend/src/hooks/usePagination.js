import { useState } from "react"
export function usePagination(total, perPage = 20) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(total / perPage)
  return {
    page, setPage, totalPages,
    next: () => setPage(p => Math.min(p + 1, totalPages)),
    prev: () => setPage(p => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  }
}
