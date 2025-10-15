import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_registration():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    data = {
        'username': 'testfaculty2',
        'email': 'faculty2@test.com',
        'password': 'testpass123',
        'password_confirm': 'testpass123', 
        'role': 'faculty'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/auth/register/', json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("✓ Registration successful!")
            return response.json()['access']
        else:
            print("✗ Registration failed!")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None


def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    data = {
        'email': 'faculty2@test.com',
        'password': 'testpass123'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/auth/login/', json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Login successful!")
            return response.json()['access']
        else:
            print("✗ Login failed!")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None


def test_profile(token):
    """Test getting user profile"""
    print("\n=== Testing Profile Retrieval ===")
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.get(f'{BASE_URL}/auth/profile/', headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Profile retrieval successful!")
        else:
            print("✗ Profile retrieval failed!")
    except Exception as e:
        print(f"✗ Error: {e}")


def test_opportunity_creation(token):
    """Test opportunity creation (if endpoint exists)"""
    print("\n=== Testing Opportunity Creation ===")
    headers = {'Authorization': f'Bearer {token}'}
    data = {
        'title': 'Software Developer',
        'description': 'Great opportunity for developers',
        'type': 'job',
        'company': 'Tech Corp',
        'location': 'Remote'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/opportunities/', json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            print("✓ Opportunity creation successful!")
        else:
            print(f"Response: {response.text}")
            print("✗ Opportunity creation failed!")
    except Exception as e:
        print(f"✗ Error: {e}")


if __name__ == '__main__':
    print("Starting API Tests...")
    
    # Test registration
    token = test_registration()
    
    if token:
        # Test profile retrieval
        test_profile(token)
        
        # Test opportunity creation (optional)
        test_opportunity_creation(token)
    
    # Test login with the newly created user
    login_token = test_login()
    
    print("\n=== API Tests Completed ===")