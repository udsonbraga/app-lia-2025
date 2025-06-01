
from django.contrib import admin
from .models import EmergencyAlert

@admin.register(EmergencyAlert)
class EmergencyAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'message_preview', 'location', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'message', 'location')
    readonly_fields = ('created_at', 'updated_at')
    
    def message_preview(self, obj):
        return obj.message[:50] + "..." if obj.message and len(obj.message) > 50 else obj.message or "Sem mensagem"
    message_preview.short_description = 'Preview da Mensagem'
