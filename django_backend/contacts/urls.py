
from django.urls import path
from . import views

urlpatterns = [
    path('', views.SafeContactListCreateView.as_view(), name='safe-contacts-list'),
    path('<uuid:pk>/', views.SafeContactDetailView.as_view(), name='safe-contact-detail'),
    path('emergency/', views.EmergencyContactListCreateView.as_view(), name='emergency-contacts-list'),
    path('emergency/<uuid:pk>/', views.EmergencyContactDetailView.as_view(), name='emergency-contact-detail'),
]
