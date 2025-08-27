from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Application
from opportunities.models import Opportunity

User = get_user_model()

class ApplicationAPITest(APITestCase):
    def setUp(self):
        self.student = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='testpass123',
            role='student'  
        )
        self.faculty = User.objects.create_user(
            username='faculty',
            email='faculty@example.com',
            password='testpass123',
            role='faculty'
        )
        self.opportunity = Opportunity.objects.create(
            title='Software Engineer',
            description='Great job',
            type='job',
            company='Tech Corp',
            created_by=self.faculty
        )
    
    def test_student_can_apply(self):
        self.client.force_authenticate(user=self.student)
        data = {
            'opportunity': self.opportunity.id,
            'cover_letter': 'I am interested',
            'resume_url': 'http://example.com/resume.pdf'
        }
        response = self.client.post('/api/applications/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_duplicate_application_rejected(self):
        self.client.force_authenticate(user=self.student)
        Application.objects.create(
            user=self.student,
            opportunity=self.opportunity,
            cover_letter='First application'
        )
        
        data = {
            'opportunity': self.opportunity.id,
            'cover_letter': 'Second application'
        }
        response = self.client.post('/api/applications/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)