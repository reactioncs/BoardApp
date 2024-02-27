from django.urls import path
from .views import *

urlpatterns = [
    path("user/d/", UserListView.as_view()), # debug
    path("user/register/", UserRegisterView.as_view()),
    path("user/login/", UserLoginView.as_view()),
    path("user/logout/", UserLogoutView.as_view()),
    path("user/", UserView.as_view()),
    path("user/<slug:pk>/", UserView.as_view()),

    path("post/", PostAPIView.as_view()),
    path("post/<slug:pk>", PostAPIView.as_view()),
    path("comment/", CommentAPIView.as_view()),
    path("comment/<slug:pk>", CommentAPIView.as_view()),
]
