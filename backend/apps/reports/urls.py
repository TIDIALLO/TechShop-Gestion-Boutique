from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('sales/', views.SalesReportView.as_view(), name='sales-report'),
    path('export/', views.ExportExcelView.as_view(), name='export-excel'),
]
