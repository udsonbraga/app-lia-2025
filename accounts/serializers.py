
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile, UserFeedback

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'name')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Conta de usuário desativada.')
            else:
                raise serializers.ValidationError('Credenciais inválidas.')
        else:
            raise serializers.ValidationError('Email e senha são obrigatórios.')
        
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user_email', 'user_name', 'avatar_url', 'created_at', 'updated_at')

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = ('id', 'feedback_type', 'content', 'created_at')
        read_only_fields = ('id', 'created_at')
