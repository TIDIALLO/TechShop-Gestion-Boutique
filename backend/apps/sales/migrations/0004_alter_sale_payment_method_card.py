from django.db import migrations, models


class Migration(migrations.Migration):
    """Active le paiement par carte bancaire (option « card »)."""

    dependencies = [
        ('sales', '0003_sale_customer_phone_sale_delivery_address_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='payment_method',
            field=models.CharField(
                choices=[
                    ('cash', 'Espèces'),
                    ('wave', 'Wave'),
                    ('orange_money', 'Orange Money'),
                    ('credit', 'Crédit'),
                    ('transfer', 'Virement'),
                    ('card', 'Carte bancaire'),
                ],
                default='cash',
                max_length=20,
                verbose_name='Mode de paiement',
            ),
        ),
    ]
