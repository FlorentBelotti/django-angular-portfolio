from rest_framework import viewsets
from .models import Project, ProjectImage
from .serializers import ProjectSerializer, ProjectImageSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related('images').all()
    serializer_class = ProjectSerializer

class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer