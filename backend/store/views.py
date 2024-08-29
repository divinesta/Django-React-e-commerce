from django.shortcuts import render, redirect
from django.db.models.aggregates import Count
from django.conf import settings

from userauths.models import User

from .models import Category, Product, Gallery, Specification, Size, Color, Coupon, Cart, CartOrder, CartOrderItem, Tax
from .serializers import CategorySerializer, ProductSerializer, CartOrderSerializer, CartOrderItemSerializer, CartSerializer, CouponSerializer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from decimal import Decimal

import stripe # type: ignore

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY


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


class CartListView(generics.ListAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def qet_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        total_total = 0.0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            total_total += float(self.calculate_total(cart_item))

        data = {
            'shipping': total_shipping,
            'tax': total_tax,
            'service_fee': total_service_fee,
            'sub_total': total_sub_total,
            'total': total_total
        }

        return Response(data, status=status.HTTP_200_OK)

    def calculate_shipping(self, cart_item):
        return cart_item.shipping_amount

    def calculate_tax(self, cart_item):
        return cart_item.tax_fee

    def calculate_service_fee(self, cart_item):
        return cart_item.service_fee

    def calculate_sub_total(self, cart_item):
        return cart_item.sub_total

    def calculate_total(self, cart_item):
        return cart_item.total


class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        # if user_id:
        #    user = User.objects.get(id=user_id)
        #    cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        # else:
        #    cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        # return cart

        try:
            if user_id:
                user = User.objects.get(id=user_id)
                cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
            else:
                cart = Cart.objects.get(id=item_id, cart_id=cart_id)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")
        except Cart.DoesNotExist:
            raise NotFound(detail="Cart item not found")

        return cart


class CartOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']
        # print("user_id ======>", user_id)

        # try:
        #    user = User.objects.get(id=user_id)
        # except:
        #    user = None
        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None

        # print("user ======>", user)

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_service_fee = Decimal(0.00)
        total_sub_total = Decimal(0.00)
        total_initial_total = Decimal(0.00)
        total_total = Decimal(0.00)

        order = CartOrder.objects.create(
            buyer=user,
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country
        )

        for cart_item in cart_items:
            total_shipping += cart_item.shipping_amount
            total_tax += cart_item.tax_fee
            total_service_fee += cart_item.service_fee
            total_sub_total += cart_item.sub_total
            total_initial_total += cart_item.total

            CartOrderItem.objects.create(
                order=order,
                product=cart_item.product,
                vendor=cart_item.product.vendor,
                quantity=cart_item.quantity,
                color=cart_item.color,
                size=cart_item.size,
                price=cart_item.price,
                sub_total=cart_item.sub_total,
                shipping_amount=cart_item.shipping_amount,
                tax_fee=cart_item.tax_fee,
                service_fee=cart_item.service_fee,
                total=cart_item.total,
                initial_total=cart_item.total
            )

            total_shipping += Decimal(cart_item.shipping_amount)
            total_tax += Decimal(cart_item.tax_fee)
            total_service_fee += Decimal(cart_item.service_fee)
            total_sub_total += Decimal(cart_item.sub_total)
            total_initial_total += Decimal(cart_item.total)
            total_total += Decimal(cart_item.total)

            order.vendor.add(cart_item.product.vendor)

        order.sub_total = total_sub_total
        order.shipping_amount = total_shipping
        order.tax_fee = total_tax
        order.service_fee = total_service_fee
        order.total = total_total

        order.save()

        return Response({'message': 'Order created successfully', "status": "success", "order_oid": order.oid, }, status=status.HTTP_201_CREATED)


class CheckoutAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_id'

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)
        return order


class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes = [AllowAny]

    def create(self, request):
        payload = request.data

        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']

        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items = CartOrderItem.objects.filter(
                order=order, vendor=coupon.vendor)
            if order_items:
                for item in order_items:
                    if not coupon in item.coupon.all():
                        discount = item.total * coupon.discount / 100
                        item.total -= discount
                        item.sub_total -= discount
                        item.coupon.add(coupon)
                        item.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        item.save()
                        order.save()

                        return Response({'message': 'Coupon Activated', 'icon': 'success'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'message': 'Coupon already used', 'icon': 'warning'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Order Item Does not exist', 'icon': 'error'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Coupon does not exist', 'icon': 'error'}, status=status.HTTP_200_OK)


class StripeCheckoutAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)

        if not order:
            return Response({'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': order.full_name,
                            },
                            'unit_amount': int(order.total * 100)
                        },
                        'quantity': 1,
                    }
                ],
                mode='payment',
                success_url='http://localhost:5173/payment-success/' +
                order.oid + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/payment-failed/?session_id={CHECKOUT_SESSION_ID}'
            )

            order.stripe_session_id = checkout_session.id
            order.save()

            return redirect(checkout_session.url)
        except stripe.error.StripeError as e:
            return Response({'message': 'Error processing payment', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

