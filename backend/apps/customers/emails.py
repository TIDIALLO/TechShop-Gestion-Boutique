"""E-mail de confirmation envoyé à la création d'un compte client."""
import logging

from django.conf import settings
from django.core import signing
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.utils.html import escape

logger = logging.getLogger('apps')

TOKEN_SALT = 'customers.email-confirmation'
TOKEN_MAX_AGE = 60 * 60 * 24 * 3  # le lien reste valable 3 jours


def make_confirmation_token(customer):
    return signing.dumps(
        {'customer_id': customer.pk, 'email': customer.email},
        salt=TOKEN_SALT,
    )


def read_confirmation_token(token):
    """Retourne les données du token, ou lève signing.BadSignature / SignatureExpired."""
    return signing.loads(token, salt=TOKEN_SALT, max_age=TOKEN_MAX_AGE)


def send_confirmation_email(customer):
    """
    Envoie le mail de bienvenue avec le lien de confirmation.
    Envoi après validation de la transaction ; une erreur d'envoi
    n'empêche jamais la création du compte.
    """
    link = f"{settings.FRONTEND_URL}/verify-email?token={make_confirmation_token(customer)}"
    name = customer.name or customer.email

    subject = "Confirmez votre compte TechShop Electronics"
    text = (
        f"Bonjour {name},\n\n"
        f"Votre compte TechShop Electronics a bien été créé.\n"
        f"Pour le confirmer, ouvrez ce lien (valable 3 jours) :\n{link}\n\n"
        f"Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.\n\n"
        f"TechShop Electronics"
    )
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111827">
      <h2 style="color:#f68b1e;margin-bottom:4px">Bienvenue chez TechShop Electronics</h2>
      <p>Bonjour <strong>{escape(name)}</strong>,</p>
      <p>Votre compte a bien été créé. Confirmez votre adresse e-mail pour finaliser votre inscription.</p>
      <p style="margin:28px 0">
        <a href="{link}"
           style="background:#f68b1e;color:#fff;padding:12px 22px;border-radius:6px;
                  text-decoration:none;font-weight:bold">Confirmer mon compte</a>
      </p>
      <p style="color:#6b7280;font-size:13px">Ce lien est valable 3 jours. Si vous n'êtes pas à
      l'origine de cette inscription, ignorez simplement ce message.</p>
      <p style="color:#6b7280;font-size:12px;margin-top:28px">TechShop Electronics</p>
    </div>
    """

    def _send():
        try:
            msg = EmailMultiAlternatives(
                subject, text, settings.DEFAULT_FROM_EMAIL, [customer.email]
            )
            msg.attach_alternative(html, "text/html")
            msg.send()
        except Exception as e:
            logger.error(f"Erreur envoi e-mail de confirmation à {customer.email}: {e}")

    transaction.on_commit(_send)
