# test_db.py
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ctc_backend.settings')
django.setup()

from django.db import connection

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version()")
        result = cursor.fetchone()
        print("✅ Database connection successful!")
        print(f"PostgreSQL version: {result[0]}")
except Exception as e:
    print("❌ Database connection failed!")
    print(f"Error: {e}")