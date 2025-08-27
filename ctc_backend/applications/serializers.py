from rest_framework import serializers
from .models import Application
from opportunities.serializers import OpportunitySerializer

class ApplicationSerializer(serializers.ModelSerializer):
    opportunity_details = OpportunitySerializer(source='opportunity', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user', 'applied_at', 'updated_at']

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['opportunity', 'cover_letter', 'resume_url']
    
    def validate_opportunity(self, value):
        user = self.context['request'].user
        if Application.objects.filter(user=user, opportunity=value).exists():
            raise serializers.ValidationError(
                "You have already applied to this opportunity."
            )
        return value

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']