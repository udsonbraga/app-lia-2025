
from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('signout', views.signout, name='signout'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('feedback/', views.UserFeedbackView.as_view(), name='user-feedback'),
]
