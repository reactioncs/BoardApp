from django.conf import settings
from django.urls import path
from .views import *

urlpatterns = [
    path("upload/", ImageUploadApi.as_view()),
    path("delete/<slug:id>/", ImageDeleteApi.as_view()),
]

if settings.DEBUG:
    urlpatterns += [path("debug/", ImageListApi.as_view())]
