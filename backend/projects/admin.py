from django.contrib import admin
from .models import Project, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    # Modifier 'date_completed' en 'date' pour correspondre à votre modèle
    list_display = ['title', 'type', 'date', 'technologies']
    list_filter = ['type', 'date']
    search_fields = ['title', 'description', 'technologies']
    inlines = [ProjectImageInline]

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'description', 'order']
    search_fields = ['project']