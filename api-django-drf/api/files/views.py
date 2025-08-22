from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def hello(req):
    """Simple endpoint to return hello"""
    return Response("Hello, World!")
