from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Opportunity
from .serializers import OpportunitySerializer, OpportunityCreateSerializer

class IsAlumniOrFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in ['alumni', 'faculty']

class OpportunityListCreateView(generics.ListCreateAPIView):
    queryset = Opportunity.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated, IsAlumniOrFaculty]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OpportunityCreateSerializer
        return OpportunitySerializer
    
    def get_queryset(self):
        queryset = Opportunity.objects.filter(is_active=True)
        opportunity_type = self.request.query_params.get('type')
        search = self.request.query_params.get('search')
        
        if opportunity_type:
            queryset = queryset.filter(type=opportunity_type)
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(company__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class OpportunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user

class MyOpportunitiesView(generics.ListAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Opportunity.objects.filter(created_by=self.request.user)