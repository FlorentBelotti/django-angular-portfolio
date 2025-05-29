from django.db import models
from django.contrib.auth.models import User

class Testimonial(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    relationship = models.CharField(max_length=100)  # ex: "Collègue", "Manager", etc.
    content = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return f"Témoignage de {self.name}"