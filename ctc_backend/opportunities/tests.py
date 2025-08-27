from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Opportunity

User = get_user_model()

class OpportunityModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='faculty',
            email='faculty@example.com',
            password='testpass123',
            role='faculty'
        )
    
    def test_create_opportunity(self):
        opportunity = Opportunity.objects.create(
            title='Software Engineer',
            description='Great opportunity',
            type='job',
            company='Tech Corp',
            created_by=self.user
        )
        self.assertEqual(opportunity.title, 'Software Engineer')
        self.assertEqual(opportunity.created_by, self.user)

class OpportunityAPITest(APITestCase):
    def setUp(self):
        self.faculty = User.objects.create_user(
            username='faculty',
            email='faculty@example.com', 
            password='testpass123',
            role='faculty'
        )
        self.student = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='testpass123', 
            role='student'
        )
    
    def test_faculty_can_create_opportunity(self):
        self.client.force_authenticate(user=self.faculty)
        data = {
            'title': 'Research Assistant',
            'description': 'Research opportunity',
            'type': 'research',
            'company': 'University'
        }
        response = self.client.post('/api/opportunities/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_student_cannot_create_opportunity(self):
        self.client.force_authenticate(user=self.student)
        data = {
            'title': 'Software Engineer',
            'description': 'Job opportunity', 
            'type': 'job',
            'company': 'Tech Corp'
        }
        response = self.client.post('/api/opportunities/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)