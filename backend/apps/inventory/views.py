"""Vues pour la gestion des stocks et approvisionnements"""
import uuid
import logging
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import StockMovement, Supply, SupplyItem
from .serializers import (
    StockMovementSerializer, CreateStockMovementSerializer,
    SupplySerializer, SupplyItemSerializer
)
from apps.products.models import Product
from apps.users.permissions import IsManager, IsManagerOrReadOnly
from apps.users.views import log_activity, get_client_ip
from apps.notifications.utils import send_low_stock_alert, send_out_of_stock_alert

logger = logging.getLogger('apps')


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    """Historique des mouvements de stock (lecture seule)"""
    queryset = StockMovement.objects.select_related(
        'product', 'supplier', 'created_by'
    ).all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsManager]
    filterset_fields = ['movement_type', 'product', 'supplier']
    search_fields = ['product__name', 'product__reference', 'reference', 'notes']
    ordering = ['-created_at']


class StockAdjustmentView(APIView):
    """Ajustement manuel du stock (entrée / sortie / ajustement)"""
    permission_classes = [IsManager]

    @transaction.atomic
    def post(self, request):
        ser = CreateStockMovementSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            product = Product.objects.select_for_update().get(
                id=data['product_id'], is_active=True
            )
        except Product.DoesNotExist:
            return Response({'error': 'Produit introuvable.'}, status=404)

        qty = data['quantity']
        movement_type = data['movement_type']
        qty_before = product.quantity

        # Calculer la nouvelle quantité
        if movement_type == 'in':
            product.quantity += qty
        elif movement_type in ['out', 'loss', 'return']:
            if product.quantity < qty:
                return Response(
                    {'error': f'Stock insuffisant. Disponible: {product.quantity}'},
                    status=400
                )
            product.quantity -= qty
        elif movement_type == 'adjustment':
            product.quantity = qty  # Ajustement direct

        product.save(update_fields=['quantity', 'updated_at'])

        # Créer le mouvement
        movement = StockMovement.objects.create(
            product=product,
            movement_type=movement_type,
            quantity=qty,
            quantity_before=qty_before,
            quantity_after=product.quantity,
            unit_price=data.get('unit_price', 0),
            notes=data.get('notes', ''),
            supplier_id=data.get('supplier_id'),
            created_by=request.user,
        )

        # Alertes : rupture (avec e-mail) ou stock bas
        if product.quantity == 0:
            send_out_of_stock_alert(product)
        elif product.is_low_stock:
            send_low_stock_alert(product, request.user)

        log_activity(
            request.user, 'update', 'Stock', product.id,
            f"Mouvement stock: {movement_type} {qty} × {product.name}",
            get_client_ip(request)
        )

        return Response(StockMovementSerializer(movement).data, status=201)


class SupplyViewSet(viewsets.ModelViewSet):
    """Gestion des approvisionnements fournisseurs"""
    queryset = Supply.objects.select_related('supplier', 'created_by').prefetch_related('items').all()
    serializer_class = SupplySerializer
    permission_classes = [IsManager]
    filterset_fields = ['status', 'supplier']
    search_fields = ['reference', 'supplier__name']
    ordering = ['-created_at']

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        # Générer référence
        reference = f"APP-{uuid.uuid4().hex[:8].upper()}"
        supply = Supply.objects.create(
            reference=reference,
            supplier_id=data.get('supplier_id'),
            notes=data.get('notes', ''),
            expected_date=data.get('expected_date'),
            created_by=request.user,
        )
        items_data = data.get('items', [])
        for item in items_data:
            SupplyItem.objects.create(
                supply=supply,
                product_id=item['product_id'],
                quantity_ordered=item['quantity_ordered'],
                quantity_received=item.get('quantity_received', 0),
                unit_price=item['unit_price'],
            )
        supply.calculate_total()
        log_activity(request.user, 'create', 'Supply', supply.id,
                     f"Nouvel appro: {supply.reference}", get_client_ip(request))
        return Response(SupplySerializer(supply).data, status=201)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def receive(self, request, pk=None):
        """Réception d'un approvisionnement → mise à jour du stock"""
        supply = self.get_object()
        if supply.status == 'received':
            return Response({'error': 'Déjà reçu.'}, status=400)

        from django.utils import timezone
        items_data = request.data.get('items', [])
        for item_data in items_data:
            try:
                item = supply.items.get(id=item_data['item_id'])
                qty_received = int(item_data.get('quantity_received', 0))
                if qty_received > 0:
                    item.quantity_received = qty_received
                    item.save()
                    # Mise à jour du stock produit
                    product = Product.objects.select_for_update().get(id=item.product_id)
                    qty_before = product.quantity
                    product.quantity += qty_received
                    product.save(update_fields=['quantity', 'updated_at'])
                    StockMovement.objects.create(
                        product=product,
                        movement_type='in',
                        quantity=qty_received,
                        quantity_before=qty_before,
                        quantity_after=product.quantity,
                        unit_price=item.unit_price,
                        reference=supply.reference,
                        supplier=supply.supplier,
                        created_by=request.user,
                        notes=f"Réception appro {supply.reference}",
                    )
            except (SupplyItem.DoesNotExist, Product.DoesNotExist):
                continue

        supply.status = 'received'
        supply.received_date = timezone.now().date()
        supply.save()
        supply.calculate_total()
        log_activity(request.user, 'update', 'Supply', supply.id,
                     f"Réception appro: {supply.reference}", get_client_ip(request))
        return Response(SupplySerializer(supply).data)
