from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import GetCSRFToken

urlpatterns = [
    
    # ADMIN
    path('admin/', admin.site.urls),

    # CSRF Token endpoint
    path('api/csrf-token/', GetCSRFToken.as_view(), name='get_csrf_token'),

    # APPs
    path('api/resume/', include('resume.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/testimonials/', include('testimonials.urls')),

    # DRF
    path('api-auth/', include('rest_framework.urls')),
]

# DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)