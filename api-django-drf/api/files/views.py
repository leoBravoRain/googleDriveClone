from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import File
from .serializers import FileSerializer

@api_view(['GET'])
def list_files(request):
    """List all files"""
    try:
        files = File.objects.all()
        serializer = FileSerializer(files, many=True)
        print(serializer.data)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": f"Error listing files: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
