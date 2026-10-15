import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "../../services/authService"

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.login(data)
    localStorage.setItem("access_token", res.data.tokens.access)
    localStorage.setItem("refresh_token", res.data.tokens.refresh)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Erreur de connexion")
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const refresh = localStorage.getItem("refresh_token")
  try { await authService.logout(refresh) } catch {}
  localStorage.clear()
})

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try { return (await authService.me()).data }
  catch (err) { return rejectWithValue(err.response?.data) }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("access_token"),
  },
  reducers: {
    clearError: state => { state.error = null },
    updateUser: (state, { payload }) => { state.user = { ...state.user, ...payload } },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, s => { s.loading = true; s.error = null })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading = false; s.user = payload.user; s.isAuthenticated = true })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload })
      .addCase(logoutUser.fulfilled, s => {
        s.user = null; s.isAuthenticated = false })
      .addCase(fetchCurrentUser.fulfilled, (s, { payload }) => {
        s.user = payload; s.isAuthenticated = true })
      .addCase(fetchCurrentUser.rejected, s => {
        s.user = null; s.isAuthenticated = false; localStorage.clear() })
  },
})
export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer
