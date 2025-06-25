from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectImageViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet)
router.register('project-images', ProjectImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]