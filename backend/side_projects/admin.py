from django.contrib import admin
from .models import SideProject

@admin.register(SideProject)
class SideProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technologies', 'date_started', 'date_completed')
    list_filter = ('technologies',)
    search_fields = ('title', 'description', 'technologies')