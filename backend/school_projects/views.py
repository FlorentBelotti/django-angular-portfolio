from rest_framework import viewsets
from .models import SchoolProject
from .serializers import SchoolProjectSerializer

class SchoolProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SchoolProject.objects.all().order_by('-date_completed')
    serializer_class = SchoolProjectSerializer