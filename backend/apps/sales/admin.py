from django.contrib import admin
from .models import Sale, SaleItem

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ['subtotal', 'profit']

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'customer', 'cashier', 'total_amount', 'profit', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_method']
    search_fields = ['invoice_number', 'customer__name']
    readonly_fields = ['invoice_number', 'subtotal', 'tax_amount', 'total_amount', 'profit', 'created_at']
    inlines = [SaleItemInline]
