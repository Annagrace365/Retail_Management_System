"""
URL configuration for retail_management project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Retail Management API",
        default_version='v1',
        description="API for Retail Management System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="admin@retailmanagement.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👇 Extra mapping so frontend's /api/auth/login/ works
    path('api/auth/login/', TokenObtainPairView.as_view(), name='api_auth_login'),

    # Include core app routes
    path('api/', include('core.urls')),

    # API docs
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
