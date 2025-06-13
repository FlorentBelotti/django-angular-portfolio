from rest_framework import viewsets
from .models import PersonalInfo, TechnicalSkill, SoftSkill, Education, WorkExperience
from .serializers import PersonalInfoSerializer, TechnicalSkillSerializer, SoftSkillSerializer, EducationSerializer, WorkExperienceSerializer
from django.db.models import Case, When, Value, IntegerField, F

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

    queryset = WorkExperience.objects.annotate(
        sort_order=Case(
            When(current=True, then=Value(1)),
            default=Value(0),
            output_field=IntegerField(),
        )
    ).order_by('-sort_order', '-end_date', '-start_date')
    
    serializer_class = WorkExperienceSerializer