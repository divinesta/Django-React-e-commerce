from django.contrib import admin
from  vendor.models import Vendor

# Register your models here.

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
   list_display = ['name', 'mobile', 'date']
   search_fields = ['name']