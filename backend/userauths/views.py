from django.shortcuts import render  
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Profile
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer


# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
   serializer_class = MyTokenObtainPairSerializer
   
class RegisterVeiw(generics.CreateAPIView):
   queryset = User.objects.all()
   permission_classes = (AllowAny, )
   serializer_class = RegisterSerializer