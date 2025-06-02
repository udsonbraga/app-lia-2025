
from django.contrib import admin
from .models import SafeContact, EmergencyContact

@admin.register(SafeContact)
class SafeContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'phone', 'email', 'relationship', 'created_at')
    list_filter = ('relationship', 'created_at')
    search_fields = ('name', 'user__email', 'phone', 'email')

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'telegram_id', 'relationship', 'created_at')
    list_filter = ('relationship', 'created_at')
    search_fields = ('name', 'user__email', 'telegram_id')
