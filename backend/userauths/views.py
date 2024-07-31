from django.shortcuts import render  
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Profile
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer


# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
   serializer_class = MyTokenObtainPairSerializer