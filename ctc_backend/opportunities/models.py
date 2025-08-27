from django.db import models
from django.conf import settings

class Opportunity(models.Model):
    OPPORTUNITY_TYPES = [
        ('job', 'Job'),
        ('internship', 'Internship'),
        ('project', 'Project'),
        ('research', 'Research'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=OPPORTUNITY_TYPES)
    company = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    requirements = models.TextField(blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.type})"