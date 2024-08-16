from django.contrib import admin
from store.models import Category, Product

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
   list_display = ['title']
   search_fields = ['title']
   
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
   list_display = ['title', 'category', 'price', 'stock_qty', 'status', 'vendor', 'date']
   search_fields = ['title']