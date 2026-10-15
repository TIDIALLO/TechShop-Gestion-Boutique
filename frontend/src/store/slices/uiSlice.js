import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: localStorage.getItem("darkMode") === "true",
    sidebarOpen: true,
    sidebarCollapsed: false,
  },
  reducers: {
    toggleDarkMode: state => {
      state.darkMode = !state.darkMode
      localStorage.setItem("darkMode", state.darkMode)
      document.body.classList.toggle("dark", state.darkMode)
    },
    toggleSidebar: state => { state.sidebarOpen = !state.sidebarOpen },
    setSidebarCollapsed: (state, { payload }) => { state.sidebarCollapsed = payload },
  },
})
export const { toggleDarkMode, toggleSidebar, setSidebarCollapsed } = uiSlice.actions
export default uiSlice.reducer
