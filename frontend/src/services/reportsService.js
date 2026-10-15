import api from "./api"
export const reportsService = {
  getDashboard:  () => api.get("/reports/dashboard/"),
  getSalesReport: params => api.get("/reports/sales/", { params }),
  exportExcel:   params => api.get("/reports/export/", { params, responseType: "blob" }),
}
