
from django.contrib import admin
from .models import DiaryEntry, DiaryAttachment

class DiaryAttachmentInline(admin.TabularInline):
    model = DiaryAttachment
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(DiaryEntry)
class DiaryEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'mood', 'date', 'created_at')
    list_filter = ('mood', 'date', 'created_at')
    search_fields = ('title', 'content', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [DiaryAttachmentInline]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(user=request.user)
        return qs

@admin.register(DiaryAttachment)
class DiaryAttachmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'entry', 'file_type', 'created_at')
    list_filter = ('file_type', 'created_at')
    search_fields = ('name', 'entry__title')
    readonly_fields = ('created_at',)
