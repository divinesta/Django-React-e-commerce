from django.contrib import admin
from store.models import Category, Product, Gallery, Specification, Color, Size, Cart, CartOrder, CartOrderItem, Review, Notification, Coupon, Wishlist, Tax

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
   list_display = ['title']
   search_fields = ['title']
   
   
class GalleryInline(admin.TabularInline):
   model = Gallery
   extra = 0
   
class SpecificationInline(admin.TabularInline):
   model = Specification
   extra = 0
   
class ColorInline(admin.TabularInline):
   model = Color
   extra = 0
class SizeInline(admin.TabularInline):
   model = Size
   extra = 0
   
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
   list_display = ['title', 'category', 'price', 'stock_qty', 'status', 'vendor', 'featured', 'date']
   # list_editable = ['price', 'stock_qty', 'status', 'vendor', 'featured']
   list_filter = ['date']
   search_fields = ['title']
   inlines = [GalleryInline, SpecificationInline, ColorInline, SizeInline]
   
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
   list_display = ['user', 'product', 'quantity', 'total', 'date']
   search_fields = ['user', 'product'] 
   
@admin.register(CartOrder)
class CartOrderAdmin(admin.ModelAdmin):
   list_display = ['buyer', 'shipping_amount', 'total', 'payment_status', 'oid', 'date']
   search_fields = ['oid', 'buyer', 'date']
   
@admin.register(CartOrderItem)
class CartOrderItemAdmin(admin.ModelAdmin):
   list_display = ['order', 'product', 'quantity', 'price', 'total', 'date']
   search_fields = ['order', 'product', 'date']
   
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
   list_display = ['user', 'product', 'rating', 'date']
   search_fields = ['product', 'user', 'date']
   
   
@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
   list_display = ['user', 'product', 'date']
   search_fields = ['product', 'user', 'date']
   
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
   list_display = ['user', 'vendor', 'order', 'order_item', 'date']
   search_fields = ['user', 'date']
   
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
   list_display = ['vendor', 'code', 'active', 'discount', 'date']
   search_fields = ['vendor', 'code', 'date']
   
   
@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
   list_display = ['country', 'active', 'rate', 'date']
   search_fields = ['date']