
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer, DiaryEntryCreateUpdateSerializer

class DiaryEntryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['mood', 'date']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return DiaryEntry.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DiaryEntryCreateUpdateSerializer
        return DiaryEntrySerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = DiaryEntrySerializer(queryset, many=True, context={'request': request})
        return Response({
            'entries': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            entry = serializer.save()
            response_serializer = DiaryEntrySerializer(entry, context={'request': request})
            return Response({
                'entry': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiaryEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return DiaryEntry.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DiaryEntryCreateUpdateSerializer
        return DiaryEntrySerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            entry = serializer.save()
            response_serializer = DiaryEntrySerializer(entry, context={'request': request})
            return Response({
                'entry': response_serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
