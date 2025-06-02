
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import EmergencyAlert
from .serializers import EmergencyAlertSerializer, EmergencyAlertCreateSerializer
import uuid

class EmergencyAlertListView(generics.ListAPIView):
    serializer_class = EmergencyAlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return EmergencyAlert.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_emergency_alert(request):
    """
    Enviar um alerta de emergência para contatos selecionados
    """
    serializer = EmergencyAlertCreateSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        alert = serializer.save()
        
        # Simular processamento do alerta
        # Em um ambiente real, aqui você implementaria:
        # - Envio de SMS
        # - Envio de emails
        # - Notificações push
        # - Integração com serviços de emergência
        
        alert.status = 'sent'
        alert.save()
        
        return Response({
            'message': 'Alerta de emergência enviado com sucesso',
            'alertId': str(alert.id),
            'status': alert.status,
            'contacts_notified': len(alert.contacts_notified)
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def emergency_alert_detail(request, alert_id):
    """
    Obter detalhes de um alerta específico
    """
    try:
        alert = EmergencyAlert.objects.get(id=alert_id, user=request.user)
        serializer = EmergencyAlertSerializer(alert)
        return Response(serializer.data)
    except EmergencyAlert.DoesNotExist:
        return Response({'error': 'Alerta não encontrado'}, status=status.HTTP_404_NOT_FOUND)
