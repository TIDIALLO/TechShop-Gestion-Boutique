from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color', 'product_count', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['reference', 'name', 'category', 'purchase_price', 'selling_price', 'quantity', 'is_low_stock', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['reference', 'name', 'barcode']
    list_editable = ['selling_price', 'quantity', 'is_active']
