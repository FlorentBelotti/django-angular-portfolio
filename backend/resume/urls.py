from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PersonalInfoViewSet, 
    TechnicalSkillViewSet, 
    SoftSkillViewSet, 
    EducationViewSet, 
    WorkExperienceViewSet
)

router = DefaultRouter()
router.register('personal-info', PersonalInfoViewSet)
router.register('technical-skills', TechnicalSkillViewSet)
router.register('soft-skills', SoftSkillViewSet)
router.register('education', EducationViewSet)
router.register('work-experience', WorkExperienceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]