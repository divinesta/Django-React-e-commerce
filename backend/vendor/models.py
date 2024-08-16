from django.db import models
from django.utils.text import slugify
from userauths.models import User

# Create your models here.
class Vendor(models.Model):
   user = models.OneToOneField(User, on_delete=models.CASCADE)
   image = models.FileField(upload_to='vendor', null=True, blank=True, default="vendor.jpg")
   name = models.CharField(max_length=100, help_text='Name of the vendor', unique=True, null=False, blank=False)
   description = models.TextField(help_text='Description of the vendor', null=True, blank=True)
   mobile = models.CharField(max_length=15, help_text='Mobile number of the vendor', null=False, blank=False)
   active = models.BooleanField(default=False)
   date = models.DateTimeField(auto_now_add=True)
   slug = models.SlugField(max_length=100, unique=True)
   
   class Meta:
      verbose_name_plural = 'Vendors'
      ordering = ['-date']
      
   def __str__(self):
      return str(self.name)
   
   def save(self, *args, **kwargs):
      if not self.slug:
         self.slug = slugify(self.name)
      
      super(Vendor, self).save(*args, **kwargs)