import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import PageTransition from "../components/motion/PageTransition"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import { useSelector } from "react-redux"

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { sidebarOpen, sidebarCollapsed } = useSelector(s => s.ui)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full shadow-xl z-10">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {sidebarOpen && (
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
