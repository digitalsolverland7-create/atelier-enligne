# Setup Guide pour Atelier En Ligne - Développement Local

## Prérequis

Cette application a été conçue pour fonctionner sur Replit et nécessite une base de données PostgreSQL. Pour le développement local, vous avez plusieurs options :

## Option 1: Utiliser une base de données cloud (Recommandé)

### 1. Créer une base de données Neon (Gratuit)

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez la chaîne de connexion DATABASE_URL

### 2. Mettre à jour le fichier .env

Remplacez la ligne DATABASE_URL dans le fichier `.env` :

```
DATABASE_URL=votre_vraie_url_de_connection_neon
```

## Option 2: PostgreSQL local

### 1. Installer PostgreSQL

- **Windows**: Téléchargez depuis [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE atelier_enligne;

# Créer un utilisateur (optionnel)
CREATE USER atelier_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE atelier_enligne TO atelier_user;
```

### 3. Mettre à jour le .env

```
DATABASE_URL=postgresql://atelier_user:votre_mot_de_passe@localhost:5432/atelier_enligne
```

## Démarrage de l'application

### 1. Installer les dépendances (déjà fait)

```bash
npm install
```

### 2. Démarrer le serveur de développement

```bash
npm run dev
```

**Note**: Si vous êtes sur Windows et que la commande npm run dev ne fonctionne pas, utilisez :

```bash
npx tsx server/index.ts
```

### 3. Accéder à l'application

L'application sera disponible sur : [http://localhost:5000](http://localhost:5000)

## Problèmes connus et solutions

### 1. Erreur "DATABASE_URL must be set"

- Vérifiez que le fichier `.env` existe et contient une DATABASE_URL valide
- Assurez-vous que la base de données est accessible

### 2. Erreur de certificat SSL

Si vous utilisez une base de données locale, ajoutez `?sslmode=disable` à la fin de votre DATABASE_URL :

```
DATABASE_URL=postgresql://username:password@localhost:5432/atelier_enligne?sslmode=disable
```

### 3. Erreur "listen ENOTSUP"

Cette erreur peut survenir sur certains systèmes Windows. Essayez de changer l'host dans `server/index.ts` :

Remplacez :
```typescript
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
```

Par :
```typescript
server.listen({
  port,
  host: "localhost",
}, () => {
```

### 4. Authentification Replit

L'application utilise l'authentification Replit. Pour le développement local, certaines fonctionnalités d'authentification peuvent ne pas fonctionner correctement.

## Structure de l'application

- **Frontend**: React + Vite (dossier `client/`)
- **Backend**: Express.js + TypeScript (dossier `server/`)
- **Base de données**: PostgreSQL avec Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **3D**: Babylon.js pour la visualisation 3D

## Commandes utiles

```bash
# Démarrage en développement
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Vérification TypeScript
npm run check

# Push du schéma de base de données
npm run db:push
```

## Support

Si vous rencontrez des problèmes, vérifiez :

1. Que Node.js est installé (version 18+)
2. Que PostgreSQL est accessible
3. Que tous les packages sont installés (`npm install`)
4. Que le fichier `.env` est correctement configuré
