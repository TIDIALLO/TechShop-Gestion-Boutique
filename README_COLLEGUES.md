# TechShop Electronics — Installation (projet complet avec données réelles)

## Ce qu'il vous faut avant de commencer

- **Docker Desktop** installé et lancé (icône 🐳 visible et stable dans la barre des tâches)
- Au moins **2 Go d'espace disque libre**
- Une connexion Internet (pour télécharger les images Docker la première fois)

## Étape 1 — Extraire le projet

Dézippez `techshop_electronics_POUR_COLLEGUES.zip` où vous voulez (ex. `C:\Users\VotreNom\Documents\techshop`).

## Étape 2 — Démarrer l'application

Ouvrez un terminal PowerShell **dans le dossier extrait** (celui qui contient `docker-compose.yml`), puis :

```powershell
docker compose up -d --build
```

Ça prend quelques minutes la première fois (téléchargement + construction des images). Vérifiez que tout tourne :

```powershell
docker compose ps
```

Vous devez voir 3 services (`db`, `backend`, `frontend`) avec le statut `Up` ou `running`.

## Étape 3 — Charger les vraies données (comptes, produits, clients, ventes)

```powershell
cmd /c "docker compose exec -T db psql -U boutique_user -d boutique_db < techshop_data_backup.sql"
```

*(le `cmd /c` est important sous Windows — sans lui, le fichier peut être mal encodé)*

Vous ne devez voir **aucune erreur rouge**. Si vous voyez des messages "already exists", c'est que cette commande a déjà été lancée une fois — ce n'est pas grave, ignorez-les.

Vérifiez que ça a marché :

```powershell
docker compose exec db psql -U boutique_user -d boutique_db -c "SELECT COUNT(*) FROM customers;"
```

Ça doit afficher un nombre (pas 0).

## Étape 4 — Charger les vraies images (produits)

```powershell
docker compose cp .\techshop_media\products backend:/app/media/products
```

## Étape 5 — Tester

Ouvrez votre navigateur sur **http://localhost:5173**

Comptes réels disponibles (demandez le mot de passe à Abdourahmane si besoin, ou utilisez un compte que vous connaissez) :
- `manager@techshop.com` — rôle manager
- `caissier@techshop.com` — rôle caissier
- un compte admin existe aussi dans la base

Vous pouvez aussi créer votre propre compte client via "Créer un compte" sur la page de connexion.

## Si quelque chose ne marche pas

**"port already in use" ou conflit de nom de conteneur** → un autre projet Docker tourne déjà avec le même nom. Faites :
```powershell
docker compose down
docker compose up -d --build
```

**Pas assez d'espace disque** → libérez de la place (Docker a besoin d'environ 1 Go minimum pour télécharger ses images).

**La page ne charge pas du tout** → vérifiez que les 3 conteneurs sont bien `Up` avec `docker compose ps`, et regardez les erreurs avec :
```powershell
docker compose logs backend --tail 50
docker compose logs frontend --tail 50
```

**Pour tout arrêter proprement** :
```powershell
docker compose down
```
*(ça garde vos données ; pour tout effacer et repartir de zéro, ajoutez `-v` à la fin — attention, ça supprime aussi les données)*
