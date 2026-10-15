"""
Modèles pour la gestion des produits et catégories
"""
from django.db import models
from django.core.validators import MinValueValidator
from apps.users.models import User


class Category(models.Model):
    """Catégorie de produit"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    description = models.TextField(blank=True, verbose_name="Description")
    color = models.CharField(max_length=7, default='#3b82f6', verbose_name="Couleur")
    icon = models.CharField(max_length=10, default='📦', verbose_name="Icône")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()


class Product(models.Model):
    """Produit avec gestion complète du stock"""
    reference = models.CharField(
        max_length=50, unique=True, verbose_name="Référence"
    )
    name = models.CharField(max_length=200, verbose_name="Nom du produit")
    description = models.TextField(blank=True, verbose_name="Description")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True,
        related_name='products', verbose_name="Catégorie"
    )
    purchase_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Prix d'achat"
    )
    selling_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Prix de vente"
    )
    quantity = models.IntegerField(
        default=0, validators=[MinValueValidator(0)],
        verbose_name="Quantité en stock"
    )
    min_stock = models.IntegerField(
        default=5, validators=[MinValueValidator(0)],
        verbose_name="Stock minimum"
    )
    image = models.ImageField(
        upload_to='products/', null=True, blank=True, verbose_name="Image"
    )
    unit = models.CharField(
        max_length=20, default='unité', verbose_name="Unité"
    )
    barcode = models.CharField(
        max_length=50, blank=True, verbose_name="Code-barres"
    )
    supplier = models.ForeignKey(
        'suppliers.Supplier', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='products',
        verbose_name="Fournisseur"
    )
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='products_created', verbose_name="Créé par"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['name']

    def __str__(self):
        return f"[{self.reference}] {self.name}"

    @property
    def margin(self):
        """Marge bénéficiaire en pourcentage"""
        if self.purchase_price > 0:
            return round(
                ((self.selling_price - self.purchase_price) / self.purchase_price) * 100, 2
            )
        return 0

    @property
    def profit_per_unit(self):
        """Bénéfice par unité"""
        return self.selling_price - self.purchase_price

    @property
    def is_low_stock(self):
        """Vrai si le stock est au niveau minimum ou en dessous"""
        return self.quantity <= self.min_stock

    @property
    def is_out_of_stock(self):
        """Vrai si rupture de stock"""
        return self.quantity == 0

    @property
    def stock_value(self):
        """Valeur totale du stock au prix d'achat"""
        return self.purchase_price * self.quantity

    @classmethod
    def generate_reference(cls):
        """Génère une référence unique automatique"""
        import uuid
        return f"PRD-{uuid.uuid4().hex[:8].upper()}"
