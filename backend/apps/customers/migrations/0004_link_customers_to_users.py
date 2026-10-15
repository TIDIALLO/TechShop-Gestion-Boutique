from django.db import migrations


def link_customers_to_users(apps, schema_editor):
    Customer = apps.get_model("customers", "Customer")
    User = apps.get_model("users", "User")

    for customer in Customer.objects.all():
        if customer.user_id:
            continue

        email = customer.email.strip().lower()
        name_parts = customer.name.strip().split()

        first_name = name_parts[0] if name_parts else ""
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        existing_user = User.objects.filter(
            email__iexact=email
        ).first()

        if existing_user and existing_user.role == "customer":
            user = existing_user

        else:
            base_username = email.split("@")[0]
            username = base_username
            counter = 1

            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            customer_email = email

            if existing_user:
                email_parts = email.split("@")
                customer_email = (
                    f"{email_parts[0]}+customer{customer.id}@{email_parts[1]}"
                )

            user = User.objects.create(
                username=username,
                email=customer_email,
                first_name=first_name,
                last_name=last_name,
                phone=customer.phone,
                password=customer.password,
                role="customer",
                is_active=customer.is_active,
                latitude=customer.latitude,
                longitude=customer.longitude,
                location_address=customer.address,
            )

        customer.user_id = user.id
        customer.save(update_fields=["user"])


def unlink_customers_from_users(apps, schema_editor):
    Customer = apps.get_model("customers", "Customer")

    Customer.objects.update(user=None)


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_alter_user_role"),
        ("customers", "0003_customer_user"),
    ]

    operations = [
        migrations.RunPython(
            link_customers_to_users,
            unlink_customers_from_users,
        ),
    ]