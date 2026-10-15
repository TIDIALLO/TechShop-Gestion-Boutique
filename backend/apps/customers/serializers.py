from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Customer


User = get_user_model()


class CustomerSerializer(serializers.ModelSerializer):
    total_purchases = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        read_only=True,
    )

    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=6,
    )

    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
            "is_verified",
        )

    def validate_email(self, value):
        email = value.strip().lower()

        instance = getattr(self, "instance", None)

        customers = Customer.objects.filter(email__iexact=email)

        if instance:
            customers = customers.exclude(pk=instance.pk)

        if customers.exists():
            raise serializers.ValidationError(
                "Un compte client existe déjà avec cette adresse email."
            )

        users = User.objects.filter(email__iexact=email)

        if instance and instance.user_id:
            users = users.exclude(pk=instance.user_id)

        if users.exists():
            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée par un autre compte."
            )

        return email

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password", "client123")

        email = validated_data["email"].strip().lower()
        name = validated_data.get("name", "").strip()
        phone = validated_data.get("phone", "")

        name_parts = name.split()

        first_name = name_parts[0] if name_parts else ""
        last_name = (
            " ".join(name_parts[1:])
            if len(name_parts) > 1
            else ""
        )

        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role="customer",
            is_active=validated_data.get("is_active", True),
            latitude=validated_data.get("latitude"),
            longitude=validated_data.get("longitude"),
            location_address=validated_data.get("address", ""),
        )

        user.set_password(password)
        user.save()

        customer = Customer.objects.create(
            user=user,
            password=user.password,
            **validated_data,
        )

        return customer

    @transaction.atomic
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        user = instance.user

        if user:
            user.email = instance.email
            user.phone = instance.phone
            user.is_active = instance.is_active
            user.latitude = instance.latitude
            user.longitude = instance.longitude
            user.location_address = instance.address

            name_parts = instance.name.strip().split()

            user.first_name = (
                name_parts[0]
                if name_parts
                else ""
            )

            user.last_name = (
                " ".join(name_parts[1:])
                if len(name_parts) > 1
                else ""
            )

            if password:
                user.set_password(password)
                instance.password = user.password

            user.save()

        instance.save()

        return instance
