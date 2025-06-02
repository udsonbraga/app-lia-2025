
from django.urls import path
from . import views

urlpatterns = [
    path('', views.DiaryEntryListCreateView.as_view(), name='diary-list-create'),
    path('<uuid:pk>/', views.DiaryEntryDetailView.as_view(), name='diary-detail'),
]
