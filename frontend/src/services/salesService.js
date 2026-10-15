import api from "./api"
export const salesService = {
  getAll:    params => api.get("/sales/", { params }),
  getById:       id => api.get(`/sales/${id}/`),
  create:      data => api.post("/sales/", data),
  approve: id => api.post(`/sales/${id}/approve/`),
  cancel:        id => api.patch(`/sales/${id}/`, { status: "cancelled" }),
  getPdf:        id => api.get(`/sales/${id}/pdf/`, { responseType: "blob" }),
  getDailySummary: () => api.get("/sales/daily_summary/"),
}
