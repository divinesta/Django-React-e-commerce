from django.shortcuts import render
from django.db.models.aggregates import Count

from userauths.models import User

from .models import Category, Product, Gallery, Specification, Size, Color, Coupon, Cart, CartOrder, CartOrderItem, Tax
from .serializers import CategorySerializer, ProductSerializer, CartOrderSerializer, CartOrderItemSerializer, CartSerializer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from decimal import Decimal



class CategoryListAPIView(generics.ListAPIView):
   # queryset = Category.objects.annotate(
      # products_count=Count('product')).all()
   queryset = Category.objects.all()
   serializer_class = CategorySerializer
   permission_classes = [AllowAny]

class ProductListAPIView(generics.ListAPIView):
   queryset = Product.objects.all()
   serializer_class = ProductSerializer
   permission_classes = [AllowAny]
   
class ProductDetailAPIView(generics.RetrieveAPIView):
   serializer_class = ProductSerializer
   permission_classes = [AllowAny]
   
   def get_object(self):
      slug = self.kwargs['slug']
      return Product.objects.get(slug=slug)
   
class CartAPIView(generics.ListCreateAPIView):
   queryset = Cart.objects.all()
   serializer_class = CartSerializer
   permission_classes = [AllowAny]
   
   def create(self, request, *args, **kwargs):
      
      # product_id = request.data.get('product_id')
      # user_id = request.data.get('user_id')
      # quantity = request.data.get('quantity')
      # price = request.data.get('price')
      # shipping_amount = request.data.get('shipping_amount')
      # country = request.data.get('country')
      # size = request.data.get('size')
      # color = request.data.get('color')
      # cart_id = request.data.get('cart_id')
      
      payload = request.data
      
      product_id = payload['product_id']
      user_id = payload['user_id']
      quantity = payload['quantity']
      price = payload['price']
      shipping_amount = payload['shipping_amount']
      country = payload['country']
      size = payload['size']
      color = payload['color']
      cart_id = payload['cart_id']
      
      product = Product.objects.get(id=product_id)
      if user_id != "undefined":
         user = User.objects.get(id=user_id)
      else:
         user = None
         
      tax = Tax.objects.filter(country=country).first()
      if tax:
         tax_rate = tax.rate / 100
      else:
         tax_rate = 0
         
      cart = Cart.objects.filter(cart_id=cart_id, product=product).first()
      
      if cart:
         cart.product = product
         cart.user = user
         cart.quantity = quantity
         cart.price = price   
         cart.sub_total = Decimal(quantity) * Decimal(price)
         cart.shipping_amount = Decimal(shipping_amount) * int(quantity)
         cart.tax_fee = int(quantity) * Decimal(tax_rate)
         cart.color = color
         cart.size = size
         cart.country = country
         cart.cart_id = cart_id
         
         service_fee_percent = 20/100
         cart.service_fee = Decimal(service_fee_percent) * cart.sub_total
         
         cart.total = cart.sub_total + cart.shipping_amount + cart.tax_fee + cart.service_fee
         
         print(f"Received data: {request.data}")
         print(f"Received country: {country}")
         
         cart.save()
         
         return Response({'message': 'Cart updated successfully'}, status=status.HTTP_200_OK)
      else:
         cart = Cart()
         cart.product = product
         cart.user = user
         cart.quantity = quantity
         cart.price = price   
         cart.sub_total = Decimal(quantity) * Decimal(price)
         cart.shipping_amount = Decimal(shipping_amount) * int(quantity)
         cart.tax_fee = int(quantity) * Decimal(tax_rate)
         cart.color = color
         cart.size = size
         cart.country = country
         cart.cart_id = cart_id
         
         service_fee_percent = 20/100
         cart.service_fee = Decimal(service_fee_percent) * cart.sub_total
         
         cart.total = cart.sub_total + cart.shipping_amount + cart.tax_fee + cart.service_fee
         cart.save()
         
         return Response({
            'message': 'Cart created Successfully'}, status=status.HTTP_201_CREATED)
