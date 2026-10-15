import api from "./api"
export const customersService = {
  getAll:    params => api.get("/customers/", { params }),
  getById:       id => api.get(`/customers/${id}/`),
  create:      data => api.post("/customers/", data),
  update: (id,data) => api.patch(`/customers/${id}/`, data),
  delete:        id => api.delete(`/customers/${id}/`),
}
