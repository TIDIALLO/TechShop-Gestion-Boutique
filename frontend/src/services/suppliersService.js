import api from "./api"
export const suppliersService = {
  getAll:    params => api.get("/suppliers/", { params }),
  getById:       id => api.get(`/suppliers/${id}/`),
  create:      data => api.post("/suppliers/", data),
  update: (id,data) => api.patch(`/suppliers/${id}/`, data),
  delete:        id => api.delete(`/suppliers/${id}/`),
}
