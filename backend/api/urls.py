from django.urls import path
from userauths import views as userauths_views
from store import views as store_views
from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register('user/token', userauths_views.MyTokenObtainPairView)

# urlpatterns = router.urls

urlpatterns = [
   path('user/token/', userauths_views.MyTokenObtainPairView.as_view()),
   path('user/token/refresh/', TokenRefreshView.as_view()),
   path('user/register/', userauths_views.RegisterVeiw.as_view()),
   path('user/password-reset/<email>/', userauths_views.PasswordRestEmailVerify.as_view()),
]