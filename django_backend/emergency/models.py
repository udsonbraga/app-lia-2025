
from django.db import models
from django.conf import settings
import uuid

class EmergencyAlert(models.Model):
    STATUS_CHOICES = [
        ('sent', 'Enviado'),
        ('delivered', 'Entregue'),
        ('failed', 'Falhou'),
        ('pending', 'Pendente'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_alerts')
    message = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    contacts_notified = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Alerta de Emergência'
        verbose_name_plural = 'Alertas de Emergência'

    def __str__(self):
        return f"Alerta de {self.user.email} - {self.created_at.strftime('%d/%m/%Y %H:%M')}"
