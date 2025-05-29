from rest_framework import serializers
from .models import Testimonial

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class TestimonialCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Testimonial
        fields = ['name', 'email', 'company', 'position', 'relationship', 'content', 'rating']
        
    def validate_rating(self, value):
        """Validation supplémentaire pour s'assurer que le rating est entre 1 et 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être comprise entre 1 et 5.")
        return value
        
    def create(self, validated_data):
        """Surcharge de create pour définir automatiquement le status sur 'pending'"""
        return Testimonial.objects.create(status='pending', **validated_data)