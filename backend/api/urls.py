from django.urls import path
from userauths import views as userauths_views
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register('user/token', userauths_views.MyTokenObtainPairView)

# urlpatterns = router.urls

urlpatterns = [
   path('user/token/', userauths_views.MyTokenObtainPairView.as_view()),
]