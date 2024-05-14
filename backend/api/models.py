import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from bucket.models import ImageModel
from django.core.exceptions import ObjectDoesNotExist


class AppUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile_picture = models.CharField("user profile picture", max_length=200, null=True, blank=True)

    follows = models.ManyToManyField("AppUser", blank=True, related_name="followers")

    location = models.CharField(max_length=120, null=True, blank=True)
    viewed_profile = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.id} {self.username} ({self.first_name} {self.last_name})"


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()
    picture = models.OneToOneField(ImageModel, models.CASCADE, null=True, related_name="post")

    user = models.ForeignKey(AppUser, models.CASCADE, related_name="posts")
    liked_users = models.ManyToManyField(AppUser, blank=True, related_name="liked_posts")

    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        try:
            self.picture.delete()
        except ObjectDoesNotExist:
            pass
        return super().delete(*args, **kwargs)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()

    user = models.ForeignKey(AppUser, models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, models.CASCADE, related_name="comments")

    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
