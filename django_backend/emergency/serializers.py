
from rest_framework import serializers
from .models import EmergencyAlert

class EmergencyAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyAlert
        fields = ('id', 'message', 'location', 'status', 'contacts_notified', 'created_at', 'updated_at')
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')

class EmergencyAlertCreateSerializer(serializers.ModelSerializer):
    contacts = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        help_text="Lista de IDs dos contatos para notificar"
    )
    
    class Meta:
        model = EmergencyAlert
        fields = ('message', 'location', 'contacts')
    
    def create(self, validated_data):
        contacts = validated_data.pop('contacts', [])
        user = self.context['request'].user
        
        alert = EmergencyAlert.objects.create(
            user=user,
            message=validated_data.get('message', ''),
            location=validated_data.get('location', ''),
            contacts_notified=[str(contact_id) for contact_id in contacts]
        )
        
        # Aqui você pode implementar a lógica de envio de alertas
        # Por exemplo, enviar SMS, email, notificações push, etc.
        
        return alert
