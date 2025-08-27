from django.urls import path
from . import views

urlpatterns = [
    path('', views.OpportunityListCreateView.as_view(), name='opportunity_list_create'),
    path('<int:pk>/', views.OpportunityDetailView.as_view(), name='opportunity_detail'),
    path('my-opportunities/', views.MyOpportunitiesView.as_view(), name='my_opportunities'),
]