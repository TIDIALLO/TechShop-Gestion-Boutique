"""Tests de sécurité et d'intégrité des commandes."""
from decimal import Decimal

import pytest
from rest_framework.test import APIClient

from apps.customers.models import Customer
from apps.products.models import Category, Product
from apps.sales.models import Sale
from apps.users.models import User

pytestmark = pytest.mark.django_db


@pytest.fixture
def category():
    return Category.objects.create(name="Téléphones")


@pytest.fixture
def make_product(category):
    def _make(reference, price="1000", stock=10):
        return Product.objects.create(
            reference=reference,
            name=f"Produit {reference}",
            category=category,
            purchase_price=Decimal("400"),
            selling_price=Decimal(price),
            quantity=stock,
        )
    return _make


@pytest.fixture
def customer_client():
    user = User.objects.create_user(
        username="client", email="client@test.sn", password="pass12345", role="customer"
    )
    Customer.objects.create(
        user=user, name="Client Test", email="client@test.sn", password="x", is_verified=True
    )
    api = APIClient()
    api.force_authenticate(user)
    return api


def _order(product, **overrides):
    item = {"product_id": product.id, "quantity": 1}
    item.update(overrides.pop("item", {}))
    return {"payment_method": "wave", "items": [item], **overrides}


def test_customer_cannot_choose_price_discount_or_tax(customer_client, make_product):
    product = make_product("A1", price="1000")

    res = customer_client.post(
        "/api/sales/",
        _order(
            product,
            item={"unit_price": "1", "discount_percent": "100"},
            discount_percent="100",
            tax_rate="0",
            amount_paid="1",
        ),
        format="json",
    )

    assert res.status_code == 201
    sale = Sale.objects.get(id=res.data["id"])
    assert sale.subtotal == Decimal("1000")
    assert sale.discount_percent == 0
    assert sale.total_amount == Decimal("1180")


def test_failed_order_rolls_back_stock_and_sale(customer_client, make_product):
    first = make_product("B1", stock=5)
    second = make_product("B2", stock=1)

    res = customer_client.post(
        "/api/sales/",
        {
            "payment_method": "cash",
            "items": [
                {"product_id": first.id, "quantity": 2},
                {"product_id": second.id, "quantity": 3},
            ],
        },
        format="json",
    )

    assert res.status_code == 400
    first.refresh_from_db()
    assert first.quantity == 5
    assert Sale.objects.count() == 0


def test_customer_cannot_read_cost_prices(customer_client, make_product):
    make_product("C1")

    res = customer_client.get("/api/products/")

    assert res.status_code == 403


def test_customer_cannot_list_other_customers(customer_client):
    Customer.objects.create(name="Autre", email="autre@test.sn", password="x")

    res = customer_client.get("/api/customers/")

    assert res.status_code == 403


def test_login_is_rate_limited():
    api = APIClient()
    for _ in range(10):
        api.post("/api/auth/login/", {"email": "x@test.sn", "password": "bad"}, format="json")

    res = api.post("/api/auth/login/", {"email": "x@test.sn", "password": "bad"}, format="json")

    assert res.status_code == 429
