import api from "./api"
export const notificationsService = {
  getAll:        () => api.get("/notifications/"),
  markAllRead:   () => api.patch("/notifications/"),
  markRead:      id => api.patch(`/notifications/${id}/`),
  delete:        id => api.delete(`/notifications/${id}/`),
}
