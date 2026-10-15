from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('movements', views.StockMovementViewSet, basename='movement')
router.register('supplies', views.SupplyViewSet, basename='supply')

urlpatterns = [
    path('', include(router.urls)),
    path('adjust/', views.StockAdjustmentView.as_view(), name='stock-adjust'),
]
