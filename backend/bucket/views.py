from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import *
from .models import *


class ImageListApi(APIView):
    """
    Get all saved images.
    """

    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ImageModelSerializer
    queryset = ImageModel.objects.all().order_by('created')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = None
        return context


class ImageUploadApi(generics.CreateAPIView):
    """
    Upload one image.
    """

    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ImageModelSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = None
        return context


class ImageDeleteApi(generics.DestroyAPIView):
    """
    Delete one image.
    """

    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def destroy(self, request, id):
        try:
            image = ImageModel.objects.get(id=id)
        except ImageModel.DoesNotExist:
            return Response("Image does not exist!", status=status.HTTP_404_NOT_FOUND)
        except ValidationError as err:
            return Response(err.message, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(image)
        return Response(status=status.HTTP_204_NO_CONTENT)
