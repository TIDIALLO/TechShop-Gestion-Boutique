from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    if created:
        from apps.notifications.models import Notification
        try:
            Notification.objects.create(
                user=instance,
                type="info",
                title="Bienvenue !",
                message=f"Bienvenue {instance.get_full_name()} sur BoutiqueManager.",
            )
        except Exception:
            pass
