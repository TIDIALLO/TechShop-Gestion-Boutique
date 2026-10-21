import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { Toaster } from "react-hot-toast"
import { store } from "./store"
import App from "./App"
import MotionProvider from "./components/motion/MotionProvider"
import "./index.css"
import "leaflet/dist/leaflet.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MotionProvider>
        <App />
      </MotionProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </Provider>
  </React.StrictMode>
)
