"""Serializers pour les produits"""

from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "color",
            "icon",
            "is_active",
            "product_count",
            "created_at",
        ]


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )
    category_color = serializers.CharField(
        source="category.color",
        read_only=True,
    )
    is_low_stock = serializers.BooleanField(read_only=True)
    is_out_of_stock = serializers.BooleanField(read_only=True)
    margin = serializers.FloatField(read_only=True)

    profit_per_unit = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "reference",
            "name",
            "category",
            "category_name",
            "category_color",
            "purchase_price",
            "selling_price",
            "quantity",
            "min_stock",
            "image",
            "unit",
            "barcode",
            "is_active",
            "is_low_stock",
            "is_out_of_stock",
            "margin",
            "profit_per_unit",
            "stock_value",
            "created_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )
    is_low_stock = serializers.BooleanField(read_only=True)
    is_out_of_stock = serializers.BooleanField(read_only=True)
    margin = serializers.FloatField(read_only=True)

    profit_per_unit = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    stock_value = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "created_by",
        ]


class ClientProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_color = serializers.CharField(
        source="category.color",
        read_only=True,
    )

    available = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "reference",
            "name",
            "category",
            "category_name",
            "category_color",
            "description",
            "selling_price",
            "quantity",
            "image",
            "unit",
            "available",
        ]

    def get_available(self, obj):
        return obj.is_active and obj.quantity > 0