from django.contrib import admin
from .models import StockMovement, Supply, SupplyItem

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['product', 'movement_type', 'quantity', 'quantity_before', 'quantity_after', 'created_by', 'created_at']
    list_filter = ['movement_type']
    search_fields = ['product__name', 'reference']
    readonly_fields = ['created_at']

class SupplyItemInline(admin.TabularInline):
    model = SupplyItem
    extra = 0

@admin.register(Supply)
class SupplyAdmin(admin.ModelAdmin):
    list_display = ['reference', 'supplier', 'status', 'total_amount', 'created_at']
    list_filter = ['status']
    inlines = [SupplyItemInline]
