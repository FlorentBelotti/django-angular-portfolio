from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    # ADMIN
    path('admin/', admin.site.urls),

    # APPs
    path('api/resume/', include('resume.urls')),
    path('api/school-projects/', include('school_projects.urls')),
    path('api/side-projects/', include('side_projects.urls')),
    path('api/testimonials/', include('testimonials.urls')),

    # DRF
    path('api-auth/', include('rest_framework.urls')),
]

# DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)