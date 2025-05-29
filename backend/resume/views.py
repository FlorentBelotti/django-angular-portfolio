from rest_framework import viewsets
from .models import PersonalInfo, TechnicalSkill, SoftSkill, Education, WorkExperience
from .serializers import PersonalInfoSerializer, TechnicalSkillSerializer, SoftSkillSerializer, EducationSerializer, WorkExperienceSerializer

# READ ONLY VIEWS

class PersonalInfoViewSet(viewsets.ModelViewSet):
    queryset = PersonalInfo.objects.all()
    serializer_class = PersonalInfoSerializer

class TechnicalSkillViewSet(viewsets.ModelViewSet):
    queryset = TechnicalSkill.objects.all()
    serializer_class = TechnicalSkillSerializer

class SoftSkillViewSet(viewsets.ModelViewSet):
    queryset = SoftSkill.objects.all()
    serializer_class = SoftSkillSerializer

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class WorkExperienceViewSet(viewsets.ModelViewSet):
    queryset = WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer