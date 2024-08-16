from django.db import models
from django.utils.text import slugify
from vendor.models import Vendor
from userauths.models import User

from shortuuid.django_fields import ShortUUIDField

# Create your models here.

class Category(models.Model):
   title = models.CharField(max_length=100, help_text='Name of the category', unique=True, null=False, blank=False)
   image = models.FileField(upload_to='category', null=True, blank=True, default="category.jpg")
   active = models.BooleanField(default=False)
   slug = models.SlugField(max_length=100, unique=True)
   
   def __str__(self):
      return str(self.title)
   class Meta:
      verbose_name_plural = 'Categories'
      ordering = ['title']
   
class Product(models.Model):
   
   STATUS = [
      ("DRAFT", 'Draft'),
      ("DISABLED", 'Disabled'),
      ("IN_REVIEW", 'In Review'),
      ("PUBLISHED", 'Published'),
   ]

   title = models.CharField(max_length=100, help_text='Name of the product', unique=True, null=False, blank=False)
   category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
   # user = models.ForeignKey(User, on_delete=models.CASCADE)
   image = models.FileField(upload_to='product', null=True, blank=True, default="product.jpg")
   description = models.TextField(help_text='Description of the product', null=True, blank=True)
   price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Price of the product')
   old_price = models.DecimalField(max_digits=12, decimal_places=2, help_text='Old Price of the product')
   shipping_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text='Shipping amount')
   stock_qty = models.IntegerField(help_text='Stock of the product', null=False, blank=False)
   in_stock = models.BooleanField(default=True)
   status = models.CharField(max_length=10, choices=STATUS, default="PUBLISHED")
   featured = models.BooleanField(default=False)
   views = models.PositiveIntegerField(default=0)
   rating = models.PositiveIntegerField(default=0)
   vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
   pid = ShortUUIDField(unique=True, length=10, prefix='PID', alphabet='abcdefghijk1234567890') 
   slug = models.SlugField(max_length=100, unique=True)
   date = models.DateTimeField(auto_now_add=True)
   
   # active = models.BooleanField(default=False)
   
   def __str__(self):
      return str(self.title)
   
   # class Meta:
   #    verbose_name_plural = 'Products'
   #    ordering = ['-date']
   
   def save(self, *args, **kwargs):
      if not self.slug:
         self.slug = slugify(self.name)
      
      super(Product, self).save(*args, **kwargs)
