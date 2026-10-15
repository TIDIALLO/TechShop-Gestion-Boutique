import api from "./api"

export const authService = {
  login: data => api.post("/auth/login/", data),

  register: data => api.post("/customers/register/", data),

  verifyEmail: token => api.post("/customers/verify-email/", { token }),

  logout: refresh => api.post("/auth/logout/", { refresh }),

  me: () => api.get("/auth/me/"),

  changePassword: data => api.put("/auth/change-password/", data),

  geolocate: data => api.post("/auth/geolocate/", data),
}