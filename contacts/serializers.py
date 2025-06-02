
from rest_framework import serializers
from .models import SafeContact, EmergencyContact

class SafeContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafeContact
        fields = ('id', 'name', 'phone', 'email', 'relationship', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ('id', 'name', 'telegram_id', 'relationship', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
