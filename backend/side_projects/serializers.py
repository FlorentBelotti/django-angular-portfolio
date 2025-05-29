from rest_framework import serializers
from .models import SideProject

class SideProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SideProject
        fields = '__all__'