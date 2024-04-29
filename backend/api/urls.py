from django.urls import path
from .views import *

urlpatterns = [
    path("user/d/", UserListView.as_view()), # debug
    path("user/register/", UserRegisterView.as_view()),
    path("user/login/", UserLoginView.as_view()),
    path("user/logout/", UserLogoutView.as_view()),
    path("user/delete/", UserDeleteView.as_view()),
    path("user/", UserView.as_view()),
    path("user/<slug:pk>/", UserView.as_view()),

    path("posts/", PostAPIView.as_view()),
    path("posts/<slug:post_id>/", PostAPIView.as_view()),
    path("posts/<slug:user_id>/posts/", PostAPIView.as_view()),
    path("posts/<slug:post_id>/comments/", CommentAPIView.as_view()),
    path("posts/<slug:post_id>/comments/<slug:comment_id>/", CommentAPIView.as_view()),
]
