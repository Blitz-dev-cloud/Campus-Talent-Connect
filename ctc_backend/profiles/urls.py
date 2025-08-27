from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProfileDetailView.as_view(), name='profile_detail'),
    path('education/', views.education_list, name='education_list'),
    path('experience/', views.experience_list, name='experience_list'),
]