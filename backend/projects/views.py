from rest_framework import viewsets
from .models import Project, ProjectImage
from .serializers import ProjectSerializer, ProjectImageSerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all().order_by('-date')
    serializer_class = ProjectSerializer

    # ADD PROJECT -> SO CLASS IMAGE CREATION

    # DELETE IMAGE

    # ADD IMAGE