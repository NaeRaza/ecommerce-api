# Ecommerce API

API REST ecommerce construite avec NestJS, Prisma 7 et PostgreSQL.

---

## Technologies

- **NestJS** — framework Node.js
- **Prisma 7** — ORM PostgreSQL
- **JWT** — authentification
- **Swagger** — documentation interactive
- **Mailtrap** — emails en développement
- **class-validator** — validation des DTOs

---

## Installation

```bash
npm install
```

## Configuration

Crée un fichier `.env` à la racine du projet :

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=ton_secret_jwt
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=ton_username
MAIL_PASS=ton_password
MAIL_FROM=noreply@ecommerce.com
```

## Base de données

```bash
# Créer les tables
npx prisma migrate dev

# Générer le client TypeScript
npx prisma generate
```

## Lancer le projet

```bash
# Développement (watch mode)
npm run start:dev

# Production
npm run start:prod
```

## Documentation Swagger

Disponible sur `http://localhost:3000/api` après avoir lancé le projet.

---

## Fonctionnalités

### Authentification
- `POST /auth/register` — créer un compte
- `POST /auth/login` — connexion, retourne un token JWT
- `GET /auth/me` — profil de l'utilisateur connecté
- `POST /auth/forgot-password` — demande de réinitialisation du mot de passe
- `POST /auth/reset-password` — réinitialiser le mot de passe

### Produits
- `GET /products` — liste avec pagination et filtres
- `GET /products/:id` — détail d'un produit
- `POST /products` — créer un produit (ADMIN)
- `PATCH /products/:id` — modifier un produit (ADMIN)
- `DELETE /products/:id` — supprimer un produit (ADMIN)

### Catégories
- `GET /category` — liste des catégories
- `GET /category/:id` — détail d'une catégorie
- `POST /category` — créer une catégorie (ADMIN)
- `DELETE /category/:id` — supprimer une catégorie (ADMIN)

### Commandes
- `POST /orders` — passer une commande (CLIENT)
- `GET /orders` — mes commandes
- `GET /orders/history` — historique avec totaux
- `GET /orders/:id` — détail d'une commande
- `PATCH /orders/:id` — modifier le statut (ADMIN)

---

## Pagination et filtres

```
GET /products?page=1&limit=10
GET /products?search=iphone
GET /products?minPrice=100&maxPrice=500
GET /products?categoryId=1
```

---

## Rôles

| Rôle | Accès |
|---|---|
| `VISITOR` | Lecture seule |
| `CLIENT` | Passer des commandes |
| `ADMIN` | Tout gérer |

---

## Emails automatiques

- **Inscription** → mail de bienvenue
- **Commande confirmée** → mail de confirmation
- **Mot de passe oublié** → mail avec token de réinitialisation

---

## Structure du projet

```
src/
├── auth/         → authentification JWT + rôles
├── products/     → CRUD produits + pagination
├── category/     → CRUD catégories
├── orders/       → gestion des commandes
├── mail/         → système d'emails
├── prisma/       → connexion base de données
└── common/       → filtres globaux
```
