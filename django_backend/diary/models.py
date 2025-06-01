
from django.db import models
from django.conf import settings
import uuid

class DiaryEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diary_entries')
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    date = models.DateField(auto_now_add=True)
    mood = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    attachments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Entrada do Diário'
        verbose_name_plural = 'Entradas do Diário'

    def __str__(self):
        return f"{self.title or self.content[:50]}... - {self.user.email}"

class DiaryAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE, related_name='attachment_files')
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='diary_attachments/')
    file_type = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.entry.title or 'Sem título'}"
