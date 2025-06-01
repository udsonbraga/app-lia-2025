
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, UserFeedback

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'is_active', 'created_at')
    list_filter = ('is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'name')
    ordering = ('-created_at',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email',)

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'feedback_type', 'created_at')
    list_filter = ('feedback_type', 'created_at')
    search_fields = ('user__email', 'content')
