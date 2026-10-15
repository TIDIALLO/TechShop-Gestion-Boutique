from rest_framework import serializers
from .models import Sale, SaleItem


class SaleItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    profit = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = SaleItem
        fields = [
            'id', 'product', 'product_name', 'product_reference',
            'quantity', 'unit_price', 'unit_cost', 'discount_percent',
            'subtotal', 'profit'
        ]


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(
        source='get_payment_method_display', read_only=True
    )
    
    class Meta:
        model = Sale
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name',
            'cashier', 'cashier_name', 'status', 'status_display',
            'payment_method', 'payment_method_display',
            'delivery_status',
            'delivery_address',
            'customer_phone',
            'subtotal', 'discount_amount', 'discount_percent',
            'tax_rate', 'tax_amount', 'total_amount', 'total_cost', 'profit',
            'amount_paid', 'change_amount', 'notes', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'invoice_number', 'cashier', 'subtotal', 'discount_amount',
            'tax_amount', 'total_amount', 'total_cost', 'profit', 'change_amount',
            'created_at'
        ]


class CreateSaleItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    discount_percent = serializers.DecimalField(
        max_digits=5, decimal_places=2, default=0, required=False
    )


class CreateSaleSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField(required=False, allow_null=True)

    payment_method = serializers.ChoiceField(
        choices=Sale.PAYMENT_METHODS,
        default='cash'
    )

    discount_percent = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    tax_rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18
    )

    amount_paid = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0
    )

    delivery_status = serializers.ChoiceField(
        choices=Sale.DELIVERY_STATUS,
        default='store',
        required=False
    )

    delivery_address = serializers.CharField(
        required=False,
        allow_blank=True
    )

    customer_phone = serializers.CharField(
        required=False,
        allow_blank=True
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True
    )

    items = CreateSaleItemSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "La vente doit contenir au moins un article."
            )
        return value
