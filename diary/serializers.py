
from rest_framework import serializers
from .models import DiaryEntry, DiaryAttachment

class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = ('id', 'title', 'content', 'date', 'mood', 'location', 'attachments', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class DiaryEntryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = ('title', 'content', 'mood', 'location', 'attachments')
    
    def create(self, validated_data):
        user = self.context['request'].user
        return DiaryEntry.objects.create(user=user, **validated_data)

class DiaryAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryAttachment
        fields = ('id', 'name', 'file', 'file_type', 'created_at')
        read_only_fields = ('id', 'created_at')
