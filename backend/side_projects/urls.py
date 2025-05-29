from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SideProjectViewSet

router = DefaultRouter()
router.register('', SideProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]