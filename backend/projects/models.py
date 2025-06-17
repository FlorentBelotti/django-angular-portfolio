from django.db import models

# Create your models here.
class Project(models.Model):
    
    TYPE_CHOICES = (
        ('school', 'School Project'),
        ('side', 'Side Project'),
        ('professional', 'Professional Project'),
    )
    type = models.CharField("Project Type", max_length=20, choices=TYPE_CHOICES)
    
    title = models.CharField("Title", max_length=255)
    description = models.TextField("Description")
    date = models.DateField("Date")
    technologies = models.CharField("Technologies", max_length=255)
    github_link = models.URLField("GitHub Link", blank=True, null=True)
    demo_link = models.URLField("Demo Link", blank=True, null=True)
    school_name = models.CharField("School Name", max_length=255, blank=True, null=True)
    company_name = models.CharField("Company Name", max_length=255, blank=True, null=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='media/projects/images/')
    description = models.CharField("Description", max_length=255, blank=True)
    order = models.PositiveSmallIntegerField("Order", default=0)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Image from project {self.project.title}"