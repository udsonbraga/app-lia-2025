
from django.urls import path
from . import views

urlpatterns = [
    path('alert', views.send_emergency_alert, name='emergency-alert'),
    path('alerts/', views.EmergencyAlertListView.as_view(), name='emergency-alerts-list'),
    path('alerts/<uuid:alert_id>/', views.emergency_alert_detail, name='emergency-alert-detail'),
]
