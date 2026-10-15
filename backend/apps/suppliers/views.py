from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Supplier
from .serializers import SupplierSerializer
from apps.users.permissions import IsManagerOrReadOnly
from apps.users.views import log_activity, get_client_ip


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'city', 'country']
    search_fields = ['name', 'contact_person', 'email', 'phone']
    ordering_fields = ['name', 'created_at']

    def perform_create(self, serializer):
        s = serializer.save()
        log_activity(self.request.user, 'create', 'Supplier', s.id,
                     f"Nouveau fournisseur: {s.name}", get_client_ip(self.request))

    def perform_update(self, serializer):
        s = serializer.save()
        log_activity(self.request.user, 'update', 'Supplier', s.id,
                     f"Modification fournisseur: {s.name}", get_client_ip(self.request))

    def perform_destroy(self, instance):
        log_activity(self.request.user, 'delete', 'Supplier', instance.id,
                     f"Suppression fournisseur: {instance.name}", get_client_ip(self.request))
        instance.delete()
