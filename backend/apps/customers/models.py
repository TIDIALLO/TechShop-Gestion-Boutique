"""Modèle Client avec historique d'achats"""

from django.db import models
from apps.users.models import User


class Customer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        null=True,
        blank=True,
    )

    name = models.CharField(
        max_length=200,
        verbose_name="Nom complet"
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Téléphone"
    )

    email = models.EmailField(
        unique=True,
        verbose_name="Email"
    )

    # Compte client temporaire
    # Ces champs seront migrés progressivement vers User.
    password = models.CharField(max_length=255)

    photo = models.ImageField(
        upload_to="customers/",
        blank=True,
        null=True,
        verbose_name="Photo"
    )

    is_verified = models.BooleanField(default=False)

    # Adresse
    address = models.TextField(
        blank=True,
        verbose_name="Adresse"
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Ville"
    )

    # Géolocalisation
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    notes = models.TextField(
        blank=True,
        verbose_name="Notes"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customers"
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def total_purchases(self):
        return self.sales.filter(status="completed").count()

    @property
    def total_spent(self):
        from django.db.models import Sum

        result = self.sales.filter(
            status="completed"
        ).aggregate(
            total=Sum("total_amount")
        )

        return result["total"] or 0