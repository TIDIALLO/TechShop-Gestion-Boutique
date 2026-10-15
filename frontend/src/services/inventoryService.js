import api from "./api"
export const inventoryService = {
  getMovements: params => api.get("/inventory/movements/", { params }),
  adjust:         data => api.post("/inventory/adjust/", data),
  getSupplies: params => api.get("/inventory/supplies/", { params }),
  createSupply:   data => api.post("/inventory/supplies/", data),
  receiveSupply: (id,data) => api.post(`/inventory/supplies/${id}/receive/`, data),
}
