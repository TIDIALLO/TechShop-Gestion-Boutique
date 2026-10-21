# Audit 360° — TechShop

Date : 2026-10-21 · Stack : Django 5.1 + DRF + JWT · React 18 + Vite + Tailwind + Redux

## 1. Ce qui a été corrigé (avec tests : `backend/apps/sales/tests.py`)

| Gravité | Problème | Correction |
|---|---|---|
| **Critique** | Un client pouvait envoyer `unit_price`, `discount_percent`, `tax_rate` dans sa commande et payer 1 FCFA (Wave/carte = commande validée automatiquement). | Pour le rôle `customer`, prix = catalogue, remise 0, TVA par défaut (`sales/views.py`). |
| **Critique** | `@transaction.atomic` + `return Response(400)` ne fait **pas** de rollback : une commande refusée au 2e article gardait la vente créée et le stock du 1er article débité. | Les erreurs métier lèvent `OrderError` (exception) → rollback complet. |
| **Haute** | Un client connecté pouvait lire `/api/products/` (prix d'achat, fournisseurs) et `/api/customers/` (données personnelles de tous les clients). | Nouvelle permission `IsStaffReadManagerWrite` (lecture réservée au personnel). |
| Moyenne | Login sans limite de tentatives (brute force). | Throttle `10/min` sur `/api/auth/login/`. |
| Moyenne | IP LAN en dur dans `settings.py`. | `ALLOWED_HOSTS` et `CSRF_TRUSTED_ORIGINS` via `.env`. |
| Moyenne | `sales/views.py` avec encodage cassé (« Ã© », « Â« ») dans les messages et la facture PDF ; emoji illisible dans le PDF. | Encodage réparé, en-tête PDF « TechShop Electronics ». |
| Moyenne | `seed.py` plantait sur base vierge (e-mail client vide en doublon) et utilisait un mode de paiement inexistant (`mobile`). | E-mails fictifs uniques, `wave` / `orange_money`. |

## 2. UX / animations ajoutées

- `framer-motion` ; `MotionProvider` respecte *prefers-reduced-motion*.
- Transitions de page (`PageTransition`), cascade (`StaggerGroup`), compteurs animés (`AnimatedNumber`) sur les KPI du dashboard.
- Squelettes de chargement (`Skeleton`, shimmer) au lieu du spinner.
- Cartes produit : survol (lift + zoom image), bouton « Ajouté ! » animé, badge panier qui « pop ».
- Modale de confirmation avec ressort + fermeture au clic extérieur (désactivée pendant le traitement).
- Pages chargées à la demande (`React.lazy`) : bundle principal 1 168 Ko → 502 Ko.
- Utilitaire `cn()` (clsx + tailwind-merge) pour une base type shadcn/ui.

## 3. Dette restante (non traitée — à prioriser)

1. **Paiement simulé** (`sales/payments.py`) : toujours accepté. Brancher PayDunya / CinetPay / Wave + webhook signé avant toute mise en production.
2. JWT dans `localStorage` (vulnérable au XSS) → cookies `HttpOnly` ; access token 8 h trop long.
3. `get_client_ip` fait confiance à `X-Forwarded-For` (falsifiable) → journal d'activité non fiable.
4. `approve` (ventes) ne vérifie pas que la commande est `pending` et n'est pas réservé aux gestionnaires.
5. Mot de passe client stocké dans `Customer.password` (champ « temporaire ») : migrer vers `User` uniquement.
6. Aucun test frontend, couverture backend très faible (5 tests) → objectif 80 %.
7. `logo.png` pèse 2,1 Mo ; `Sales`/`NewSale` (979 lignes) à découper.
8. Pas de CI (GitHub Actions) ni de PostgreSQL pour les tests.

## 4. Chantiers pour les étudiants (par niveau)

**Débutant**
- Skeletons sur Products, Sales, Customers (réutiliser `Skeleton`).
- `EmptyState` animé avec illustration ; messages d'erreur d'API uniformes.
- Compresser les images (WebP) et ajouter `width/height` pour éviter les sauts de mise en page.
- Mode sombre complet (aujourd'hui seule la classe `body.dark` existe) avec bouton dans la TopBar.

**Intermédiaire**
- Animation « vol vers le panier » (image qui rejoint l'icône panier).
- Recherche produit instantanée avec suggestions (`useDebounce` existe déjà) + filtres par prix/marque.
- Page produit détaillée + galerie + avis clients (modèle `Review` côté Django).
- Favoris / liste de souhaits ; produits similaires.
- Suivi de commande client avec timeline animée (`delivery_status` existe).
- Tests Pytest : stock, remises, permissions par rôle (viser 80 %).

**Avancé**
- Intégration réelle d'un paiement mobile (webhook + idempotence + statut `pending` → `completed`).
- Authentification par cookies HttpOnly + refresh silencieux.
- Notifications temps réel (Django Channels / SSE) pour les nouvelles commandes.
- Codes promo et coupons, avec règles serveur (jamais côté client).
- PWA (installable, mode hors-ligne pour la caisse), i18n FR/EN/Wolof.
- CI GitHub Actions : tests + build + lint, Docker de production (gunicorn + nginx).
