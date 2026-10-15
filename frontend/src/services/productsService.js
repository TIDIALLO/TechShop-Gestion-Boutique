import api from "./api"
export const productsService = {
getClientProducts: params => api.get("/products/client/", { params }),
  getAll:    params => api.get("/products/", { params }),
  getById:       id => api.get(`/products/${id}/`),
  create:      data => api.post("/products/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id,data) => api.patch(`/products/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete:        id => api.delete(`/products/${id}/`),
  getLowStock:   () => api.get("/products/low_stock_alerts/"),
  getStats:      () => api.get("/products/stats/"),
  // Categories
  getCategories: params => api.get("/products/categories/", { params }),
  createCategory:  data => api.post("/products/categories/", data),
  updateCategory:  (id,data) => api.patch(`/products/categories/${id}/`, data),
  deleteCategory:  id => api.delete(`/products/categories/${id}/`),
}
