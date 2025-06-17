from django.contrib import admin
from .models import SchoolProject

@admin.register(SchoolProject)
class SchoolProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technologies', 'date_completed')
    search_fields = ('title', 'description', 'technologies')