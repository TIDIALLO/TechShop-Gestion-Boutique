from django.db import models
from apps.users.models import User


class Notification(models.Model):
    TYPE_CHOICES = [
        ('low_stock', 'Alerte stock bas'),
        ('out_of_stock', 'Rupture de stock'),
        ('sale', 'Nouvelle vente'),
        ('supply', 'Approvisionnement'),
        ('info', 'Information'),
        ('warning', 'Avertissement'),
        ('error', 'Erreur'),
    ]
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications'
    )
    type = models.CharField(max_length=15, choices=TYPE_CHOICES, default='info')
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.CharField(max_length=200, blank=True)  # URL de redirection
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.title} → {self.user.email}"
