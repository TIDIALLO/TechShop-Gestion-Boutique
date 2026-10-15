from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core import signing
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer
from .serializers import CustomerSerializer
from .emails import send_confirmation_email, read_confirmation_token

from apps.users.permissions import IsManagerOrReadOnly
from apps.users.views import log_activity, get_client_ip


class CustomerViewSet(viewsets.ModelViewSet):
    """CRUD complet des clients avec historique."""

    queryset = Customer.objects.select_related("user").all()
    serializer_class = CustomerSerializer
    permission_classes = [IsManagerOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["is_active", "city"]
    search_fields = ["name", "phone", "email", "city"]
    ordering_fields = ["name", "created_at"]

    def perform_create(self, serializer):
        customer = serializer.save()

        log_activity(
            self.request.user,
            "create",
            "Customer",
            customer.id,
            f"Nouveau client : {customer.name}",
            get_client_ip(self.request),
        )

    def perform_update(self, serializer):
        customer = serializer.save()

        log_activity(
            self.request.user,
            "update",
            "Customer",
            customer.id,
            f"Modification client : {customer.name}",
            get_client_ip(self.request),
        )

    def perform_destroy(self, instance):
        log_activity(
            self.request.user,
            "delete",
            "Customer",
            instance.id,
            f"Suppression client : {instance.name}",
            get_client_ip(self.request),
        )

        instance.delete()

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="register",
    )
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = serializer.save()

        # Mail de confirmation envoyé à la création du compte
        send_confirmation_email(customer)

        return Response(
            {
                "success": True,
                "message": (
                    "Compte créé avec succès. Un e-mail de confirmation "
                    f"a été envoyé à {customer.email}."
                ),
                "customer": self.get_serializer(customer).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        authentication_classes=[],
        url_path="verify-email",
    )
    def verify_email(self, request):
        """Confirme l'adresse e-mail à partir du lien reçu par mail."""
        token = request.data.get("token", "")

        try:
            data = read_confirmation_token(token)
        except signing.SignatureExpired:
            return Response(
                {"error": "Ce lien a expiré. Veuillez créer un nouveau compte ou contacter la boutique."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except signing.BadSignature:
            return Response(
                {"error": "Lien de confirmation invalide."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            customer = Customer.objects.get(
                pk=data["customer_id"], email=data["email"]
            )
        except Customer.DoesNotExist:
            return Response(
                {"error": "Compte introuvable."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not customer.is_verified:
            customer.is_verified = True
            customer.save(update_fields=["is_verified"])

        return Response({"success": True, "message": "Adresse e-mail confirmée."})