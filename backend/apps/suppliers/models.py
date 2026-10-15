"""Modèle Fournisseur avec historique des approvisionnements"""
from django.db import models


class Supplier(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nom du fournisseur")
    contact_person = models.CharField(max_length=100, blank=True, verbose_name="Contact")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")
    address = models.TextField(blank=True, verbose_name="Adresse")
    city = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    country = models.CharField(max_length=100, default="Sénégal", verbose_name="Pays")
    # Géolocalisation
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'suppliers'
        verbose_name = 'Fournisseur'
        verbose_name_plural = 'Fournisseurs'
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def total_supplies(self):
        return self.supplies.count()

    @property
    def total_supply_amount(self):
        from django.db.models import Sum
        result = self.supplies.aggregate(total=Sum('total_amount'))
        return result['total'] or 0
