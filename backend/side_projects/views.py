from django.shortcuts import render
from rest_framework import viewsets
from .models import SideProject
from .serializers import SideProjectSerializer

class SideProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SideProject.objects.all().order_by('-date_started')
    serializer_class = SideProjectSerializer