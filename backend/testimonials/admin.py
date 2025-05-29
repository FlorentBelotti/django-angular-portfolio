from django.contrib import admin
from .models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'rating', 'created_at', 'status')
    list_filter = ('status', 'rating', 'created_at')
    search_fields = ('name', 'email', 'company', 'content')
    actions = ['approve_testimonials', 'reject_testimonials']
    
    def approve_testimonials(self, request, queryset):
        queryset.update(status='approved')
    approve_testimonials.short_description = "Approuver les témoignages sélectionnés"
    
    def reject_testimonials(self, request, queryset):
        queryset.update(status='rejected')
    reject_testimonials.short_description = "Rejeter les témoignages sélectionnés"