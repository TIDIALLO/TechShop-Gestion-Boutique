from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationView.as_view(), name='notifications'),
    path('<int:pk>/', views.NotificationReadView.as_view(), name='notification-detail'),
]
