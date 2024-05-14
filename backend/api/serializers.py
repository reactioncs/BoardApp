from rest_framework import serializers
from .models import *

AppUser.is_authenticated


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    firstName = serializers.CharField(source="first_name", required=True)
    lastName = serializers.CharField(source="last_name", required=True)
    profilePicture = serializers.CharField(source="profile_picture", required=False, default=None)

    class Meta:
        model = AppUser
        fields = ["id", "username", "password", "firstName", "lastName", "email", "location", "profilePicture"]

    def create(self, validated_data) -> AppUser:
        return AppUser.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=150)


class PostSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source="user", read_only=True)
    firstName = serializers.ReadOnlyField(source="user.first_name")
    lastName = serializers.ReadOnlyField(source="user.last_name")
    userPicture = serializers.ReadOnlyField(source="user.profile_picture")
    picture = serializers.ReadOnlyField(source="picture.file.url")
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ["id", "content", "picture", "userId", "firstName", "lastName", "userPicture", "comments", "created"]


class SetPictureSerializer(serializers.Serializer):
    pictureId = serializers.CharField(allow_blank=True, required=True)


class CommentSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source="user", read_only=True)
    postId = serializers.PrimaryKeyRelatedField(source="post", read_only=True)
    firstName = serializers.ReadOnlyField(source="user.first_name")
    lastName = serializers.ReadOnlyField(source="user.last_name")
    userPicture = serializers.ReadOnlyField(source="user.profile_picture")

    class Meta:
        model = Comment
        fields = ["id", "content", "userId", "postId", "firstName", "lastName", "userPicture", "created"]
