
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import User, UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Criar perfil automaticamente quando um usuário é criado"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_auth_token(sender, instance, created, **kwargs):
    """Criar token de autenticação automaticamente quando um usuário é criado"""
    if created:
        Token.objects.create(user=instance)
