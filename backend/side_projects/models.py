from django.db import models

# Create your models here.
class SideProject(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=200)
    image = models.ImageField(upload_to='project_images', blank=True)
    github_link = models.URLField(blank=True)
    demo_link = models.URLField(blank=True)
    date_started = models.DateField()
    date_completed = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.title