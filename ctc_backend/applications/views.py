from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Application
from .serializers import (
    ApplicationSerializer, 
    ApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer
)
from opportunities.models import Opportunity

class CanApplyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'

class ApplicationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), CanApplyPermission()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)

@api_view(['GET'])
def opportunity_applications(request, opportunity_id):
    """View applications for a specific opportunity (for opportunity creators only)"""
    opportunity = get_object_or_404(Opportunity, id=opportunity_id)
    
    if opportunity.created_by != request.user:
        return Response(
            {'error': 'You can only view applications for your own opportunities'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    applications = Application.objects.filter(opportunity=opportunity)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_application_status(request, application_id):
    """Update application status (for opportunity creators only)"""
    application = get_object_or_404(Application, id=application_id)
    
    if application.opportunity.created_by != request.user:
        return Response(
            {'error': 'You can only update applications for your own opportunities'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ApplicationStatusUpdateSerializer(
        application, 
        data=request.data, 
        partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(ApplicationSerializer(application).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)