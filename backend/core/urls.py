from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet, ProductViewSet, SupplierViewSet, 
    OrderViewSet, PaymentViewSet, ProductSupplierViewSet, dashboard_stats
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'product-suppliers', ProductSupplierViewSet)

urlpatterns = [
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)),
]