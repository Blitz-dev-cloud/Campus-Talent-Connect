from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Profile, Education, Experience

User = get_user_model()

class ProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com', 
            password='testpass123',
            role='student'
        )
    
    def test_create_profile(self):
        profile = Profile.objects.create(
            user=self.user,
            full_name='Test User',
            bio='Test bio',
            skills=['Python', 'Django']
        )
        self.assertEqual(profile.full_name, 'Test User')
        self.assertEqual(profile.skills, ['Python', 'Django'])

class ProfileAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123', 
            role='student'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_profile(self):
        data = {
            'full_name': 'Test User',
            'bio': 'Test bio',
            'skills': ['Python', 'Django'],
            'phone': '1234567890',
            'location': 'Test City'
        }
        response = self.client.post('/api/profiles/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)