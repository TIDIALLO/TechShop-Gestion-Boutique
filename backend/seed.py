"""
BoutiqueManager — TechShop Dakar — Boutique Électronique
Données de démonstration avec produits exacts
Usage Windows : python manage.py shell -c "exec(open('seed.py').read())"
Usage Linux   : python manage.py shell < seed.py
"""
import os
import random
from decimal import Decimal
from datetime import timedelta

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.utils import timezone
from django.core.files.base import ContentFile
from apps.users.models import User
from apps.products.models import Category, Product
from apps.suppliers.models import Supplier
from apps.customers.models import Customer
from apps.sales.models import Sale, SaleItem
from apps.notifications.models import Notification

print("🏪 Initialisation — TechShop Dakar (Électronique)")
print("=" * 55)

# ── Utilisateurs ──────────────────────────────────────────
USERS = [
    ("admin@boutique.sn",    "admin",    "Amadou",  "Diallo", "admin",   "+221771000001"),
    ("manager@boutique.sn",  "manager",  "Fatou",   "Ndiaye", "manager", "+221771000002"),
    ("caissier@boutique.sn", "caissier", "Omar",    "Ba",     "cashier", "+221771000003"),
]
users = {}
for email, username, first, last, role, phone in USERS:
    if not User.objects.filter(email=email).exists():
        u = User.objects.create_user(
            email=email, username=username, first_name=first,
            last_name=last, phone=phone, password="Pass@1234", role=role,
        )
        print(f"  ✅ {role.capitalize()}: {email} / Pass@1234")
    else:
        u = User.objects.get(email=email)
        print(f"  ✓  Existant: {email}")
    users[role] = u

admin = users.get("admin")

# ── 18 Catégories électroniques ───────────────────────────
CATS = [
    ("Smartphones",               "📱", "#2563eb"),
    ("Ordinateurs portables",     "💻", "#1d4ed8"),
    ("Ordinateurs de bureau",     "🖥️",  "#7c3aed"),
    ("Tablettes",                 "⬜", "#0891b2"),
    ("Téléviseurs",               "📺", "#0f766e"),
    ("Imprimantes",               "🖨️",  "#b45309"),
    ("Écouteurs et casques",      "🎧", "#db2777"),
    ("Accessoires informatiques", "⌨️",  "#16a34a"),
    ("Composants informatiques",  "🔧", "#dc2626"),
    ("Réseaux et connectivité",   "📡", "#ea580c"),
    ("Stockage et mémoire",       "💾", "#4f46e5"),
    ("Gaming et consoles",        "🎮", "#9333ea"),
    ("Caméras et appareils photo","📷", "#0284c7"),
    ("Montres connectées",        "⌚", "#059669"),
    ("Chargeurs et batteries",    "🔋", "#ca8a04"),
    ("Câbles et adaptateurs",     "🔌", "#64748b"),
    ("Haut-parleurs et audio",    "🔊", "#be185d"),
    ("Sécurité et surveillance",  "🔐", "#374151"),
]
cats = {}
for name, icon, color in CATS:
    c, created = Category.objects.get_or_create(
        name=name,
        defaults={"icon": icon, "color": color,
                  "description": f"Produits électroniques — {name}"}
    )
    cats[name] = c
print(f"  ✅ {len(cats)} catégories créées")

# ── 6 Fournisseurs spécialisés ─────────────────────────────
SUPPLIERS = [
    ("Samsung Electronics Dakar",  "Mamadou Koné",  "+221338101010", "samsung@dakar.sn",  "Dakar"),
    ("Apple Authorized Reseller",  "Awa Thiam",     "+221338202020", "apple@reseller.sn", "Dakar"),
    ("HP & Dell Distribution SN",  "Ibrahima Sarr", "+221338303030", "hp.dell@sn.com",    "Dakar"),
    ("Sony & LG Sénégal",          "Rokhaya Fall",  "+221338404040", "sonylg@sn.com",     "Thiès"),
    ("TechZone Import",            "Cheikh Mbaye",  "+221338505050", "techzone@sn.com",   "Dakar"),
    ("GamingPro West Africa",      "Aïssatou Diop", "+221338606060", "gaming@pro.sn",     "Dakar"),
]
suppliers = []
for name, contact, phone, email, city in SUPPLIERS:
    s, _ = Supplier.objects.get_or_create(
        name=name,
        defaults={"contact_person": contact, "phone": phone,
                  "email": email, "city": city}
    )
    suppliers.append(s)
print(f"  ✅ {len(suppliers)} fournisseurs créés")

# ── Produits exacts (spécifiés par l'utilisateur) ─────────
#  Colonnes: (ref, nom, catégorie, prix_achat, prix_vente, stock, min_stock, sup_idx, image_svg)
PRODUCTS = [
    # ─ Smartphones ─
    ("ELEC-0001","Samsung Galaxy S25",        "Smartphones",             520000, 650000, 15, 3, 0, "samsung_galaxy_s25.svg"),
    ("ELEC-0002","iPhone 17",                 "Smartphones",             720000, 900000, 10, 2, 1, "iphone_17.svg"),
    # ─ Ordinateurs portables ─
    ("ELEC-0003","HP Pavilion 15",            "Ordinateurs portables",   420000, 550000,  8, 2, 2, "hp_pavilion_15.svg"),
    ("ELEC-0004","Dell Inspiron 14",          "Ordinateurs portables",   365000, 480000,  6, 2, 2, "dell_inspiron_14.svg"),
    ("ELEC-0005","MacBook Air M5",            "Ordinateurs portables",   760000, 950000,  5, 1, 1, "macbook_air_m5.svg"),
    # ─ Téléviseurs ─
    ("ELEC-0006","Samsung Smart TV 55 pouces","Téléviseurs",             320000, 420000,  4, 1, 0, "samsung_tv_55.svg"),
    ("ELEC-0007","LG Smart TV 43 pouces",     "Téléviseurs",             210000, 280000,  7, 2, 3, "lg_tv_43.svg"),
    # ─ Tablettes ─
    ("ELEC-0008","iPad Air",                  "Tablettes",               350000, 450000,  6, 2, 1, "ipad_air.svg"),
    ("ELEC-0009","Samsung Galaxy Tab S10",    "Tablettes",               300000, 390000,  5, 2, 0, "samsung_tab_s10.svg"),
    # ─ Imprimantes ─
    ("ELEC-0010","HP LaserJet Pro",           "Imprimantes",             135000, 180000,  5, 2, 2, "hp_laserjet.svg"),
    ("ELEC-0011","Canon PIXMA G3470",         "Imprimantes",             105000, 145000,  7, 2, 4, "canon_pixma.svg"),
    # ─ Écouteurs et casques ─
    ("ELEC-0012","AirPods Pro",               "Écouteurs et casques",    130000, 170000, 12, 3, 1, "airpods_pro.svg"),
    ("ELEC-0013","Sony WH-1000XM6",           "Écouteurs et casques",    175000, 230000,  8, 2, 3, "sony_wh1000xm6.svg"),
    # ─ Accessoires informatiques ─
    ("ELEC-0014","Clavier mécanique Logitech","Accessoires informatiques",32000,  45000, 20, 5, 4, "clavier_logitech.svg"),
    ("ELEC-0015","Souris sans fil Logitech",  "Accessoires informatiques",17000,  25000, 25, 5, 4, "souris_logitech.svg"),
    # ─ Stockage et mémoire ─
    ("ELEC-0016","Disque SSD Samsung 1 To",   "Stockage et mémoire",      58000,  75000, 18, 5, 0, "ssd_samsung_1to.svg"),
    ("ELEC-0017","Barrette RAM 16 Go DDR5",   "Stockage et mémoire",      42000,  55000, 15, 4, 4, "ram_16go_ddr5.svg"),
    ("ELEC-0018","Clé USB 64 Go SanDisk",     "Stockage et mémoire",       7500,  12000, 30, 8, 4, "cle_usb_sandisk.svg"),
    # ─ Gaming et consoles ─
    ("ELEC-0019","PlayStation 5",             "Gaming et consoles",      350000, 450000,  4, 1, 5, "playstation5.svg"),
    ("ELEC-0020","Manette PS5 DualSense",     "Gaming et consoles",       33000,  45000, 10, 3, 5, "manette_ps5.svg"),
    # ─ Montres connectées ─
    ("ELEC-0021","Apple Watch Series 11",     "Montres connectées",      210000, 280000,  6, 2, 1, "apple_watch_s11.svg"),
    ("ELEC-0022","Samsung Galaxy Watch",      "Montres connectées",      135000, 180000,  8, 2, 0, "samsung_galaxy_watch.svg"),
]

from django.conf import settings
MEDIA_DIR = os.path.join(settings.MEDIA_ROOT, "products")
products = []
for ref, name, cat_name, purchase, selling, qty, min_stock, sup_idx, img_file in PRODUCTS:
    p, created = Product.objects.get_or_create(
        reference=ref,
        defaults={
            "name": name,
            "category": cats[cat_name],
            "purchase_price": Decimal(purchase),
            "selling_price": Decimal(selling),
            "quantity": qty,
            "min_stock": min_stock,
            "supplier": suppliers[sup_idx],
            "description": (
                f"{name} — Produit électronique de qualité, "
                f"disponible chez TechShop Dakar. "
                f"Prix: {selling:,} FCFA. Stock: {qty} unités."
            ),
            "created_by": admin,
            "unit": "unité",
        }
    )
    # Attach SVG image
    svg_path = os.path.join(MEDIA_DIR, img_file)
    if not p.image and os.path.exists(svg_path):
        # Le fichier est déjà dans media/products : on le référence sans le dupliquer.
        p.image.name = f"products/{img_file}"
        p.save(update_fields=["image"])

    products.append(p)
    status = "créé" if created else "existant"
    margin = round((selling - purchase) / purchase * 100, 1)
    print(f"  {'✅' if created else '✓ '} [{ref}] {name} — {selling:,} FCFA (marge: {margin}%)")

print(f"\n  📦 {len(products)} produits électroniques prêts")

# ── 12 Clients ────────────────────────────────────────────
CUSTOMERS = [
    ("Moussa Diallo",         "+221771234567", "moussa.diallo@email.sn",  "Médina, Dakar"),
    ("Fatou Ndiaye",          "+221782345678", "fatou.ndiaye@email.sn",   "Plateau, Dakar"),
    ("Ibrahima Sow",          "+221763456789", "ibra.sow@email.sn",       "Thiès Centre"),
    ("Aminata Ba",            "+221774567890", "aminata.ba@email.sn",     "Parcelles Assainies"),
    ("Omar Diop",             "+221785678901", "omar.diop@email.sn",      "Saint-Louis"),
    ("Rokhaya Fall",          "+221776789012", None,                       "Grand-Yoff, Dakar"),
    ("Cheikh Touré",          "+221787890123", None,                       "Kaolack"),
    ("Awa Mbaye",             "+221768901234", "awa.mbaye@email.sn",      "Sicap Liberté"),
    ("Youssou Dembélé",       "+221779012345", None,                       "Guédiawaye"),
    ("Marième Seck",          "+221780123456", "marieme@email.sn",        "Rufisque"),
    ("Entreprise InfoTech SN","+221338111222", "infotech@entreprise.sn",  "Zone Industrielle, Dakar"),
    ("Cabinet Dr. Ibrahima Bâ","+221338333444","cabinet.ba@sante.sn",    "Almadies, Dakar"),
]
customers = []
for index, (name, phone, email, address) in enumerate(CUSTOMERS, start=1):
    # Customer.email est unique : un client sans e-mail reçoit une adresse fictive distincte.
    c, _ = Customer.objects.get_or_create(
        name=name,
        defaults={"phone": phone, "email": email or f"client{index}@demo.techshop.sn", "address": address}
    )
    customers.append(c)
print(f"  ✅ {len(customers)} clients créés")

# ── Ventes réalistes (30 jours d'historique) ──────────────
cashier = users.get("cashier", admin)
manager_u = users.get("manager", admin)
payment_methods = ["cash","cash","cash","wave","orange_money","card","transfer"]

# Regrouper par type pour ventes réalistes
smartphones_laptops = [p for p in products if p.category.name in ["Smartphones","Ordinateurs portables","Tablettes"]]
tvs_consoles = [p for p in products if p.category.name in ["Téléviseurs","Gaming et consoles","Montres connectées"]]
accessories = [p for p in products if p.category.name in ["Accessoires informatiques","Stockage et mémoire","Câbles et adaptateurs","Chargeurs et batteries"]]
audio = [p for p in products if p.category.name in ["Écouteurs et casques","Haut-parleurs et audio"]]

created_sales = 0
for days_ago in range(30, 0, -1):
    base_dt = timezone.now() - timedelta(days=days_ago)
    dow = base_dt.weekday()
    # Weekends plus actifs pour l'électronique
    n_sales = random.randint(5, 14) if dow >= 5 else random.randint(3, 8)

    for _ in range(n_sales):
        sale_dt = base_dt.replace(
            hour=random.randint(9, 19),
            minute=random.randint(0, 59),
            second=random.randint(0, 59),
        )
        sale = Sale(
            invoice_number=Sale.generate_invoice_number(),
            customer=random.choice(customers + [None]*4),
            cashier=random.choice([cashier, cashier, manager_u]),
            status="completed",
            payment_method=random.choice(payment_methods),
            discount_percent=random.choice([0,0,0,0,0,2,3,5]),
            tax_rate=18,
            amount_paid=0,
        )
        sale.save()
        Sale.objects.filter(pk=sale.pk).update(created_at=sale_dt)

        # Panier réaliste pour boutique électronique
        basket = []
        r = random.random()

        if r < 0.35 and smartphones_laptops:
            # Achat principal : smartphone ou laptop
            main = random.choice(smartphones_laptops)
            basket.append((main, 1))
            # Accessoire complémentaire (prob 55%)
            if random.random() < 0.55 and accessories:
                acc = random.choice(accessories)
                if acc.id not in [x[0].id for x in basket]:
                    basket.append((acc, random.randint(1, 2)))
        elif r < 0.55 and accessories:
            # Achat accessoires uniquement
            n = random.randint(1, 3)
            chosen = random.sample(accessories, min(n, len(accessories)))
            for p in chosen:
                basket.append((p, random.randint(1, 3)))
        elif r < 0.70 and audio:
            # Écouteurs / casques
            main = random.choice(audio)
            basket.append((main, 1))
        elif r < 0.85 and tvs_consoles:
            # TV ou console
            main = random.choice(tvs_consoles)
            basket.append((main, 1))
        else:
            # Produit aléatoire
            main = random.choice(products)
            basket.append((main, 1))

        for prod, qty in basket:
            if prod.quantity <= 0:
                continue
            safe_qty = min(qty, prod.quantity, 3)
            if safe_qty < 1:
                continue
            SaleItem.objects.create(
                sale=sale,
                product=prod,
                product_name=prod.name,
                product_reference=prod.reference,
                quantity=safe_qty,
                unit_price=prod.selling_price,
                unit_cost=prod.purchase_price,
                discount_percent=0,
            )

        sale.calculate_totals()
        # Simuler montant reçu (arrondi supérieur)
        total = float(sale.total_amount)
        paid = total + random.choice([0, 0, 0, 5000, 10000, 25000])
        Sale.objects.filter(pk=sale.pk).update(amount_paid=paid)
        sale.refresh_from_db()
        sale.calculate_totals()
        created_sales += 1

print(f"  ✅ {created_sales} ventes créées (30 jours)")

# ── Alertes stock ─────────────────────────────────────────
low = [p for p in products if p.quantity <= p.min_stock]
for p in low:
    Notification.objects.get_or_create(
        user=admin, title=f"⚠️ Stock bas — {p.name}",
        defaults={
            "type": "low_stock",
            "message": (
                f"«{p.name}» (Réf: {p.reference}) — "
                f"Stock: {p.quantity} unité(s) / Minimum: {p.min_stock}. "
                "Veuillez réapprovisionner."
            ),
            "link": f"/products/{p.id}",
        }
    )
if low:
    print(f"  ⚠️  {len(low)} alertes stock bas créées")

print("")
print("=" * 60)
print("  🎉 TECHSHOP DAKAR — INITIALISATION COMPLÈTE !")
print("=" * 60)
print(f"  📦 {len(products)} produits électroniques")
print(f"  🗂️  {len(cats)} catégories")
print(f"  👥 {len(customers)} clients")
print(f"  🏭 {len(suppliers)} fournisseurs")
print(f"  🛒 {created_sales} ventes (30 jours)")
print("=" * 60)
print("  👤 Admin    : admin@boutique.sn    / Pass@1234")
print("  👤 Manager  : manager@boutique.sn  / Pass@1234")
print("  👤 Caissier : caissier@boutique.sn / Pass@1234")
print("=" * 60)
