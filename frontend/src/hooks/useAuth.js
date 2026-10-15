import { useSelector } from "react-redux"
export function useAuth() {
  const { user, isAuthenticated, loading } = useSelector(s => s.auth)
  return {
    user, isAuthenticated, loading,
    isAdmin: user?.role === "admin",
    isManager: ["admin","manager"].includes(user?.role),
    isCashier: user?.role === "cashier",
    canManage: ["admin","manager"].includes(user?.role),
  }
}
