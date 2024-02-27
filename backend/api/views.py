from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *
from .models import *


class UserListView(generics.ListAPIView):
    """
    DEBUG ONLY
    """

    authentication_classes = []
    serializer_class = UserSerializer
    queryset = AppUser.objects.all()


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

    def delete(self, request):
        user_id = request.user.id
        user = AppUser.objects.get(id=user_id)
        user.delete()
        return Response("delete successful.", status=status.HTTP_200_OK)


class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, **serializer.data)
        if user is None:
            return Response("Wrong password or username!", status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        return Response("Log in successful", status=status.HTTP_200_OK)


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

    def get(self, request, pk=None):
        if pk is None:
            posts = Post.objects.all()
            return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)
        else:
            try:
                post = Post.objects.get(id=pk)
            except Post.DoesNotExist:
                return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)
            return Response(PostSerializer(post).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk=None):
        if pk is None:
            return Response("Missing post id.", status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        if not (post.user.id == request.user.id or request.user.is_superuser):
            return Response("Authentication error.", status=status.HTTP_400_BAD_REQUEST)

        post.delete()
        return Response("Post deleted.", status=status.HTTP_200_OK)


class CommentAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get(self, request, pk=None):
        if pk is None:
            return Response("Missing comment id.", status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return Response("Comment doesn't exist.", status=status.HTTP_404_NOT_FOUND)
        return Response(CommentSerializer(comment).data, status=status.HTTP_200_OK)

    def post(self, request):
        post_id = request.query_params.get("postId", None)
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

    def delete(self, request, pk=None):
        if pk is None:
            return Response("Missing comment id.", status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return Response("Post doesn't exist.", status=status.HTTP_404_NOT_FOUND)

        if not (comment.user.id == request.user.id or request.user.is_superuser):
            return Response("Authentication error.", status=status.HTTP_400_BAD_REQUEST)

        comment.delete()
        return Response("Comment deleted.", status=status.HTTP_200_OK)
