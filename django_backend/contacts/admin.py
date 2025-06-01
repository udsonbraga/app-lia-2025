
from django.contrib import admin
from .models import SafeContact, EmergencyContact

@admin.register(SafeContact)
class SafeContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'phone', 'email', 'relationship', 'created_at')
    list_filter = ('relationship', 'created_at')
    search_fields = ('name', 'phone', 'email', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'telegram_id', 'relationship', 'created_at')
    list_filter = ('relationship', 'created_at')
    search_fields = ('name', 'telegram_id', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
