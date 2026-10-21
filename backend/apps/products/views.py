from django.db import models
"""Vues pour la gestion des produits"""
import logging
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ClientProductSerializer,
)


from apps.users.permissions import IsManagerOrReadOnly, IsManager, IsStaffReadManagerWrite
from apps.users.views import log_activity, get_client_ip

logger = logging.getLogger('apps')


class CategoryViewSet(viewsets.ModelViewSet):
    """CRUD complet des catégories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsManagerOrReadOnly]
    search_fields = ['name', 'description']
    filterset_fields = ['is_active']

    def get_authenticators(self):
        # Lecture publique : un ancien token expiré ne doit pas bloquer l'accueil (401).
        if self.request.method in permissions.SAFE_METHODS:
            return []
        return super().get_authenticators()

    def get_permissions(self):
        # La page d'accueil est visible sans se connecter :
        # la lecture des catégories est publique, l'écriture reste réservée.
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        cat = serializer.save()
        log_activity(
            self.request.user, 'create', 'Category', cat.id,
            f"Création catégorie: {cat.name}", get_client_ip(self.request)
        )

    def perform_destroy(self, instance):
        log_activity(
            self.request.user, 'delete', 'Category', instance.id,
            f"Suppression catégorie: {instance.name}", get_client_ip(self.request)
        )
        instance.delete()


class ProductViewSet(viewsets.ModelViewSet):
    """CRUD complet des produits avec filtres avancés"""
    queryset = Product.objects.select_related('category', 'supplier').all()
    permission_classes = [IsStaffReadManagerWrite]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'supplier']
    search_fields = ['name', 'reference', 'description', 'barcode']
    ordering_fields = ['name', 'selling_price', 'quantity', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # Filtres supplémentaires
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        low_stock = self.request.query_params.get('low_stock')

        if min_price:
            qs = qs.filter(selling_price__gte=min_price)
        if max_price:
            qs = qs.filter(selling_price__lte=max_price)
        if low_stock == 'true':
            # Produits dont la quantité <= stock minimum
            from django.db.models import F
            qs = qs.filter(quantity__lte=F('min_stock'), is_active=True)
        return qs

    def perform_create(self, serializer):
        # Générer référence automatique si non fournie
        ref = self.request.data.get('reference') or Product.generate_reference()
        product = serializer.save(created_by=self.request.user, reference=ref)
        log_activity(
            self.request.user, 'create', 'Product', product.id,
            f"Création produit: {product.name}", get_client_ip(self.request)
        )

    def perform_update(self, serializer):
        product = serializer.save()
        log_activity(
            self.request.user, 'update', 'Product', product.id,
            f"Modification produit: {product.name}", get_client_ip(self.request)
        )

    def perform_destroy(self, instance):
        log_activity(
            self.request.user, 'delete', 'Product', instance.id,
            f"Suppression produit: {instance.name}", get_client_ip(self.request)
        )
        instance.delete()

    @action(detail=False, methods=['get'])
    def low_stock_alerts(self, request):
        """Produits en alerte de stock"""
        from django.db.models import F
        products = Product.objects.filter(
            quantity__lte=F('min_stock'), is_active=True
        ).order_by('quantity')
        return Response({
            'count': products.count(),
            'products': ProductListSerializer(products, many=True).data
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques globales des produits"""
        from django.db.models import Sum, Count, Avg
        total = Product.objects.filter(is_active=True)
        from django.db.models import F
        return Response({
            'total_products': total.count(),
            'total_stock_value': float(
                total.aggregate(
                    val=Sum(
                        models.ExpressionWrapper(
                            F('purchase_price') * F('quantity'),
                            output_field=models.DecimalField()
                        )
                    )
                )['val'] or 0
            ),
            'low_stock_count': total.filter(quantity__lte=F('min_stock')).count(),
            'out_of_stock_count': total.filter(quantity=0).count(),
            'avg_margin': float(total.aggregate(
                avg=Avg(
                    models.ExpressionWrapper(
                        (F('selling_price') - F('purchase_price')) / F('purchase_price') * 100,
                        output_field=models.DecimalField()
                    )
                )
            )['avg'] or 0),
        })

class ClientCatalogPagination(PageNumberPagination):
    """Pages plus larges pour afficher tout le catalogue sur la page d'accueil"""
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 500


class ClientProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Catalogue des produits visible par les clients"""

    serializer_class = ClientProductSerializer
    # Catalogue consultable sans compte (la connexion est demandée à la commande)
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    pagination_class = ClientCatalogPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["category"]

    search_fields = [
        "name",
        "reference",
        "description",
    ]

    ordering_fields = [
        "name",
        "selling_price",
        "created_at",
    ]

    ordering = ["name"]

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category")
            .filter(
                is_active=True,
                quantity__gt=0,
            )
        )
    