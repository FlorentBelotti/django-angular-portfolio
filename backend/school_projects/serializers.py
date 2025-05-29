from rest_framework import serializers
from .models import SchoolProject

class SchoolProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolProject
        fields = '__all__'