from rest_framework import serializers
from .models import Opportunity

class OpportunitySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class OpportunityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['title', 'description', 'type', 'company', 'location', 
                 'requirements', 'salary_range', 'application_deadline']
    
    def validate_type(self, value):
        user = self.context['request'].user
        if value == 'research' and user.role != 'faculty':
            raise serializers.ValidationError(
                "Only Faculty members can create Research opportunities."
            )
        return value