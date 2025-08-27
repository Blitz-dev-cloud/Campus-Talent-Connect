import requests
import json

BASE_URL = 'http://localhost:8000/api'

# Test user registration
def test_registration():
    data = {
        'username': 'testfaculty',
        'email': 'faculty@test.com',
        'password': 'testpass123',
        'password_confirm': 'testpass123', 
        'role': 'faculty'
    }
    response = requests.post(f'{BASE_URL}/auth/register/', json=data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 201:
        return response.json()['access']
    return None

# Test opportunity creation
def test_opportunity_creation(token):
    headers = {'Authorization': f'Bearer {token}'}
    data = {
        'title': 'Software Developer',
        'description': 'Great opportunity for developers',
        'type': 'job',
        'company': 'Tech Corp',
        'location': 'Remote'
    }
    response = requests.post(f'{BASE_URL}/opportunities/', json=data, headers=headers)
    print(f"Opportunity creation: {response.status_code}")
    return response.json() if response.status_code == 201 else None

if __name__ == '__main__':
    token = test_registration()
    if token:
        opportunity = test_opportunity_creation(token)
        print("API tests completed!")