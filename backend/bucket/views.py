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

    def get(self, request):
        serializer = ImageModelSerializer(ImageModel.objects.all().order_by('created'), many=True)
        return Response(serializer.data)


class ImageUploadApi(generics.CreateAPIView):
    """
    Upload one image.
    """

    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ImageModelSerializer


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
