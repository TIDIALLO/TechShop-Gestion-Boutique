import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "./store/slices/authSlice"

// Layouts
import MainLayout from "./layouts/MainLayout"

// Auth
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import VerifyEmail from "./pages/auth/VerifyEmail"

// Accueil boutique
import HomePage from "./pages/home/HomePage"

// Client
import ClientDashboard from "./pages/client/ClientDashboard"
import ClientProducts from "./pages/client/ClientProducts"
import ClientCart from "./pages/client/ClientCart"
// Pages
import Dashboard from "./pages/dashboard/Dashboard"
import Products from "./pages/products/Products"
import Sales from "./pages/sales/Sales"
import NewSale from "./pages/sales/NewSale"
import Customers from "./pages/customers/Customers"
import Suppliers from "./pages/suppliers/Suppliers"
import Inventory from "./pages/inventory/Inventory"
import Reports from "./pages/reports/Reports"
import Users from "./pages/users/Users"
import Activity from "./pages/users/Activity"
import Profile from "./pages/profile/Profile"
import MapPage from "./pages/map/MapPage"


function RequireAuth({ children, roles }) {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (roles && !roles.includes(user?.role)) {
    const redirectPath =
      user?.role === "customer"
        ? "/client"
        : "/dashboard"

    return <Navigate to={redirectPath} replace />
  }

  return children
}


export default function App() {
  const dispatch = useDispatch()

  const {
    isAuthenticated,
    user,
    loading,
  } = useSelector(state => state.auth)

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark")
    }
  }, [])

  if (
    localStorage.getItem("access_token") &&
    isAuthenticated &&
    !user &&
    loading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Accueil e-commerce : visible sans se connecter */}
        <Route path="/" element={<HomePage />} />

        {/* Espace client */}
        <Route
          path="/client"
          element={
            <RequireAuth roles={["customer"]}>
              <ClientDashboard />
            </RequireAuth>
          }
        />
        {/* Boutique e-commerce : accessible à tout utilisateur connecté,
            quel que soit son rôle (admin, manager, cashier ou customer) */}
        {/* Panier et catalogue visibles sans compte : la connexion est demandée à la commande */}
        <Route path="/client/cart" element={<ClientCart />} />
        <Route path="/client/products" element={<ClientProducts />} />
        {/* Espace administration */}
        <Route
          element={
            <RequireAuth roles={["admin", "manager", "cashier"]}>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/products"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Products />
              </RequireAuth>
            }
          />

          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/new" element={<NewSale />} />

          <Route
            path="/customers"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Customers />
              </RequireAuth>
            }
          />

          <Route
            path="/suppliers"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Suppliers />
              </RequireAuth>
            }
          />

          <Route
            path="/inventory"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Inventory />
              </RequireAuth>
            }
          />

          <Route
            path="/reports"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Reports />
              </RequireAuth>
            }
          />

          <Route
            path="/users"
            element={
              <RequireAuth roles={["admin"]}>
                <Users />
              </RequireAuth>
            }
          />

          <Route
            path="/activity"
            element={
              <RequireAuth roles={["admin"]}>
                <Activity />
              </RequireAuth>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapPage />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? user?.role === "customer"
                    ? "/client"
                    : "/dashboard"
                  : "/"
              }
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}