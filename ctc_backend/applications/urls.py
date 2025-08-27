from django.urls import path
from . import views

urlpatterns = [
    path('', views.ApplicationListCreateView.as_view(), name='application_list_create'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application_detail'),
    path('opportunity/<int:opportunity_id>/', views.opportunity_applications, name='opportunity_applications'),
    path('status/<int:application_id>/', views.update_application_status, name='update_application_status'),
]