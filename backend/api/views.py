from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from rest_framework import status
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *
from .models import *


@api_view(["GET"])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
def api_default(request):
    response = [
        "/api/user/register/",
        "/api/user/login/",
        "/api/user/logout/",
        "/api/user/delete/",
        "/api/user/",
        "/api/user/<slug:pk>/",
        "/api/posts/",
        "/api/posts/<slug:post_id>/",
        "/api/posts/<slug:post_id>/setPicture/"
        "/api/posts/<slug:user_id>/posts/",
        "/api/posts/<slug:post_id>/comments/",
        "/api/posts/<slug:post_id>/comments/<slug:comment_id>/",
        "/api/bucket/upload/",
        "/api/bucket/delete/<slug:id>/",
    ]
    return Response(response, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    authentication_classes = []
    serializer_class = UserSerializer
    queryset = AppUser.objects.all()

    def get(self, request, *args, **kwargs):
        if not settings.DEBUG:
            return redirect("/api/user/")
        return super().get(request, *args, **kwargs)


class UserView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, pk=None):
        user_id = request.user.id if pk is None else pk

        try:
            user = AppUser.objects.get(id=user_id)
        except AppUser.DoesNotExist:
            return Response("User doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserAuthViewBase(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    @staticmethod
    def operation(request, user) -> str: ...

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, **serializer.data)
        if user is None:
            return Response("Wrong password or username!", status=status.HTTP_400_BAD_REQUEST)

        try:
            message = self.operation(request, user)
        except Exception as ex:
            return Response(str(ex), status=status.HTTP_400_BAD_REQUEST)

        return Response(message, status=status.HTTP_200_OK)


class UserLoginView(UserAuthViewBase):
    @staticmethod
    def operation(request, user) -> str:
        login(request, user)
        return "Log in successful."


class UserDeleteView(UserAuthViewBase):
    @staticmethod
    def operation(request, user: AppUser) -> str:
        if request.user != user:
            raise Exception("Invalid operation!")
        user.delete()
        return "Delete account successful."


class UserLogoutView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = None

    def post(self, request):
        logout(request)
        return Response("Log out successful", status=status.HTTP_200_OK)


class PostAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get(self, request, post_id=None, user_id=None):
        # get specific post by post_id
        if post_id is not None:
            try:
                post = Post.objects.get(id=post_id).order_by('-created')
            except Post.DoesNotExist:
                return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)
            return Response(PostSerializer(post).data, status=status.HTTP_200_OK)
        # get posts of a specific user
        elif user_id is not None:
            try:
                user = AppUser.objects.get(id=user_id).order_by('-created')
            except AppUser.DoesNotExist:
                return Response("User doesn't exist.", status=status.HTTP_404_NOT_FOUND)
            posts = Post.objects.filter(user=user)
            return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)
        # default
        else:
            posts = Post.objects.all().order_by('-created')
            return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, post_id=None):
        if post_id is None:
            return Response("Missing post id.", status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        if not (post.user.id == request.user.id or request.user.is_superuser):
            return Response("Authentication error.", status=status.HTTP_401_UNAUTHORIZED)

        post.delete()
        return Response("Post deleted.", status=status.HTTP_200_OK)


class PostSetPictureAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SetPictureSerializer

    def post(self, request, post_id):
        try:
            serializer = SetPictureSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            pictureId = serializer.data["pictureId"]

            post = Post.objects.get(id=post_id)

            if not (post.user.id == request.user.id or request.user.is_superuser):
                return Response("Authentication error.", status=status.HTTP_401_UNAUTHORIZED)

            if len(pictureId) == 0:
                post.picture = None
            else:
                image = ImageModel.objects.get(id=pictureId)
                post.picture = image
            post.save()
        except Post.DoesNotExist:
            return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)
        except ImageModel.DoesNotExist:
            return Response("Picture doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        return Response(PostSerializer(post).data, status=status.HTTP_200_OK)


class CommentAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get(self, request, post_id, comment_id=None):
        if post_id is None:
            return Response("Missing postId.", status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response("Invalid postId.", status=status.HTTP_404_NOT_FOUND)

        if comment_id is None:
            comments = Comment.objects.filter(post=post)
            return Response(CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)
        else:
            try:
                comment = Comment.objects.get(id=comment_id, post=post)
            except Comment.DoesNotExist:
                return Response("Comment doesn't exist.", status=status.HTTP_404_NOT_FOUND)
            return Response(CommentSerializer(comment).data, status=status.HTTP_200_OK)

    def post(self, request, post_id, comment_id=None):
        if post_id is None:
            return Response("Missing postId.", status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response("Invalid postId.", status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, post_id, comment_id=None):
        if post_id is None:
            return Response("Missing postId.", status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response("Invalid postId.", status=status.HTTP_404_NOT_FOUND)

        if comment_id is None:
            return Response("Missing comment id.", status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment.objects.get(id=comment_id, post=post)
        except Comment.DoesNotExist:
            return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        if not (comment.user.id == request.user.id or request.user.is_superuser):
            return Response("Authentication error.", status=status.HTTP_401_UNAUTHORIZED)

        comment.delete()
        return Response("Comment deleted.", status=status.HTTP_200_OK)
