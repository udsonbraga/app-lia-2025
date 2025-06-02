
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import SafeContact, EmergencyContact
from .serializers import SafeContactSerializer, EmergencyContactSerializer

class SafeContactListCreateView(generics.ListCreateAPIView):
    serializer_class = SafeContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'relationship']
    ordering = ['name']
    
    def get_queryset(self):
        return SafeContact.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SafeContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SafeContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SafeContact.objects.filter(user=self.request.user)

class EmergencyContactListCreateView(generics.ListCreateAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'relationship']
    ordering = ['name']
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)
