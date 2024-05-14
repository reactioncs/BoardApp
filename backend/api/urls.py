from django.conf import settings
from django.urls import path, re_path
from .views import *

urlpatterns = []

if settings.DEBUG:
    urlpatterns += [path("user/debug/", UserListView.as_view())]

urlpatterns += [
    path("user/", UserView.as_view()),
    path("user/register/", UserRegisterView.as_view()),
    path("user/login/", UserLoginView.as_view()),
    path("user/logout/", UserLogoutView.as_view()),
    path("user/delete/", UserDeleteView.as_view()),
    path("user/<slug:pk>/", UserView.as_view()),
    
    path("posts/", PostAPIView.as_view()),
    path("posts/<slug:post_id>/", PostAPIView.as_view()),
    path("posts/<slug:post_id>/setPicture/", PostSetPictureAPIView.as_view()),
    path("posts/<slug:user_id>/posts/", PostAPIView.as_view()),
    path("posts/<slug:post_id>/comments/", CommentAPIView.as_view()),
    path("posts/<slug:post_id>/comments/<slug:comment_id>/", CommentAPIView.as_view()),
]

urlpatterns += [
    path("", api_default),
    re_path(r"^.*/$", api_default),
]
