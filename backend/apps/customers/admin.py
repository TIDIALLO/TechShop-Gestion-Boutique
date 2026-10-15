from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'city', 'total_purchases', 'is_active']
    search_fields = ['name', 'phone', 'email']
    list_filter = ['is_active', 'city']
