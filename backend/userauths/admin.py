from django.contrib import admin
from userauths.models import Profile, User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
   list_display = ['full_name', 'email', 'phone']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
   list_display = ['full_name', 'gender', 'country', 'date']
   search_fields = ['full_name']
   list_filter = ['date']

