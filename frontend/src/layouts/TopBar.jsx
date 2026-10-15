import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useAuth } from "../hooks/useAuth"
import { logoutUser } from "../store/slices/authSlice"
import { toggleDarkMode, toggleSidebar } from "../store/slices/uiSlice"
import { notificationsService } from "../services/notificationsService"
import {
  Menu, Bell, Sun, Moon, LogOut, User, ChevronDown, Store,
} from "lucide-react"
import toast from "react-hot-toast"

export default function TopBar({ onMobileMenuOpen }) {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [darkMode, setDarkModeLocal] = useState(
    localStorage.getItem("darkMode") === "true"
  )
  const notifsRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const close = e => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false)
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await notificationsService.getAll()
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unread_count || 0)
    } catch {}
  }

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead()
    setUnreadCount(0)
    setNotifications(n => n.map(x => ({ ...x, is_read: true })))
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success("Déconnexion réussie")
    navigate("/login")
  }

  const handleDarkMode = () => {
    dispatch(toggleDarkMode())
    setDarkModeLocal(!darkMode)
  }

  const NOTIF_COLORS = {
    low_stock: "bg-orange-100 text-orange-700",
    out_of_stock: "bg-red-100 text-red-700",
    sale: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Mobile menu */}
        <button onClick={onMobileMenuOpen} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {/* Desktop sidebar toggle */}
        <button onClick={() => dispatch(toggleSidebar())} className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Accès rapide à la boutique */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700 px-2 py-1.5 rounded-lg hover:bg-accent-50"
        >
          <Store className="w-4 h-4" />
          <span className="hidden sm:inline">Boutique</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {/* Dark mode */}
        <button onClick={handleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead}
                    className="text-xs text-accent-600 hover:underline">
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div className="overflow-y-auto max-h-72">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">Aucune notification</div>
                ) : notifications.slice(0, 10).map(n => (
                  <div key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.is_read ? "bg-accent-50/50" : ""}`}>
                    <div className="flex items-start space-x-3">
                      <span className={`badge text-xs mt-0.5 ${NOTIF_COLORS[n.type] || "bg-gray-100 text-gray-700"}`}>
                        {n.type_display}
                      </span>
                      {!n.is_read && <div className="w-2 h-2 bg-accent-500 rounded-full mt-1 flex-shrink-0 ml-auto" />}
                    </div>
                    <p className="font-medium text-xs text-gray-800 mt-1">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button onClick={() => setShowUser(!showUser)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role_display}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in py-1">
              <Link to="/profile" onClick={() => setShowUser(false)}
                className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                <User className="w-4 h-4" /><span>Mon profil</span>
              </Link>
              <hr className="my-1 border-gray-100" />
              <button onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600">
                <LogOut className="w-4 h-4" /><span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
