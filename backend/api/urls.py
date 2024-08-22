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
   path('user/password-reset/<email>/',
      userauths_views.PasswordRestEmailVerify.as_view(), name="password_reset"),
   path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name="pssword_change"),


   #store endpoints
   path('category/', store_views.CategoryListAPIView.as_view()),
   path('products/', store_views.ProductListAPIView.as_view()),
   path('products/<slug:slug>/', store_views.ProductDetailAPIView.as_view()),
]