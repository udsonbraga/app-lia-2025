
from rest_framework import serializers
from .models import DiaryEntry, DiaryAttachment

class DiaryAttachmentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = DiaryAttachment
        fields = ('id', 'name', 'url', 'file_type', 'created_at')
    
    def get_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

class DiaryEntrySerializer(serializers.ModelSerializer):
    attachment_files = DiaryAttachmentSerializer(many=True, read_only=True)
    text = serializers.CharField(source='content')  # Compatibilidade com frontend
    
    class Meta:
        model = DiaryEntry
        fields = (
            'id', 'title', 'content', 'text', 'date', 'mood', 
            'location', 'attachments', 'attachment_files',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        # Remove 'text' do validated_data se estiver presente
        validated_data.pop('text', None)
        
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Se não há título, criar um baseado no conteúdo
        if not validated_data.get('title'):
            content = validated_data.get('content', '')
            validated_data['title'] = content[:50] + '...' if len(content) > 50 else content
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Remove 'text' do validated_data se estiver presente
        validated_data.pop('text', None)
        
        # Atualizar título se não fornecido
        if not validated_data.get('title'):
            content = validated_data.get('content', instance.content)
            validated_data['title'] = content[:50] + '...' if len(content) > 50 else content
        
        return super().update(instance, validated_data)

class DiaryEntryCreateUpdateSerializer(serializers.ModelSerializer):
    attachment_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = DiaryEntry
        fields = (
            'id', 'title', 'content', 'date', 'mood', 
            'location', 'attachments', 'attachment_files',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        attachment_files = validated_data.pop('attachment_files', [])
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Criar título se não fornecido
        if not validated_data.get('title'):
            content = validated_data.get('content', '')
            validated_data['title'] = content[:50] + '...' if len(content) > 50 else content
        
        entry = super().create(validated_data)
        
        # Criar anexos
        for file in attachment_files:
            DiaryAttachment.objects.create(
                entry=entry,
                name=file.name,
                file=file,
                file_type=file.content_type or 'unknown'
            )
        
        return entry
