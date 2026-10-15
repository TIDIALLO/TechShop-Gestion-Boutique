from rest_framework import serializers
from .models import StockMovement, Supply, SupplyItem
from apps.products.serializers import ProductListSerializer


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_reference = serializers.CharField(source='product.reference', read_only=True)
    movement_type_display = serializers.CharField(
        source='get_movement_type_display', read_only=True
    )
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', read_only=True
    )
    total_value = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'product_reference',
            'movement_type', 'movement_type_display', 'quantity',
            'quantity_before', 'quantity_after', 'unit_price', 'total_value',
            'reference', 'notes', 'supplier', 'created_by_name', 'created_at'
        ]
        read_only_fields = [
            'id', 'quantity_before', 'quantity_after', 'created_by', 'created_at'
        ]


class CreateStockMovementSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    movement_type = serializers.ChoiceField(choices=StockMovement.MOVEMENT_TYPES)
    quantity = serializers.IntegerField(min_value=1)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = serializers.CharField(required=False, allow_blank=True)
    supplier_id = serializers.IntegerField(required=False, allow_null=True)


class SupplyItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )

    class Meta:
        model = SupplyItem
        fields = [
            'id', 'product', 'product_name', 'quantity_ordered',
            'quantity_received', 'unit_price', 'subtotal'
        ]


class SupplySerializer(serializers.ModelSerializer):
    items = SupplyItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(
        source='created_by.get_full_name', read_only=True
    )

    class Meta:
        model = Supply
        fields = [
            'id', 'reference', 'supplier', 'supplier_name', 'status',
            'status_display', 'total_amount', 'notes', 'expected_date',
            'received_date', 'items', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'reference', 'created_by', 'created_at']
