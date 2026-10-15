import api from "./api"
export const usersService = {
  getAll:    params => api.get("/auth/users/", { params }),
  getById:       id => api.get(`/auth/users/${id}/`),
  create:      data => api.post("/auth/register/", data),
  update: (id,data) => api.patch(`/auth/users/${id}/`, data),
  delete:        id => api.delete(`/auth/users/${id}/`),
  getActivity:   () => api.get("/auth/activity/"),
}
