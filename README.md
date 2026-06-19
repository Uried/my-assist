# MyAssist

Application de gestion des tâches d'une assistante de Direction / secrétariat d'entreprise.

## Technologies

- HTML5
- JavaScript vanilla
- Tailwind CSS
- localStorage pour la persistance des données

## Structure du projet

```
myassist/
│
├── index.html
├── login.html
├── dashboard.html
├── courriers.html
├── rendez-vous.html
├── contacts.html
├── documents.html
├── rapports.html
├── utilisateurs.html
├── parametres.html
│
├── assets/
│   ├── css/
│   │   └── input.css
│   ├── js/
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── storage.js
│   │   ├── dashboard.js
│   │   ├── courriers.js
│   │   ├── rendezvous.js
│   │   ├── contacts.js
│   │   ├── documents.js
│   │   ├── rapports.js
│   │   ├── utilisateurs.js
│   │   └── parametres.js
│   └── img/
│
├── dist/
│   └── output.css
│
├── package.json
├── tailwind.config.js
└── README.md
```

## Installation

1. Cloner ou télécharger le projet
2. Naviguer dans le dossier du projet
3. Installer les dépendances :

```bash
npm install
```

## Développement

Pour compiler le CSS en mode watch (recompilation automatique) :

```bash
npm run dev
```

Pour compiler le CSS une seule fois :

```bash
npm run build
```

## Lancement de l'application

Ouvrir `login.html` avec un serveur local (ex: Live Server dans VS Code).

## Compte par défaut

- **Email** : admin@myassist.local
- **Mot de passe** : Admin123!
- **Rôle** : admin

## Fonctionnalités

### 1. Dashboard
- Statistiques globales (courriers, rendez-vous, documents)
- Derniers courriers
- Prochains rendez-vous
- Activité récente

### 2. Courriers
- Gestion complète des courriers entrants et sortants
- Création, modification, suppression
- Filtrage par type, priorité et statut
- Recherche par référence, objet, expéditeur, destinataire
- Références automatiques (ex: COUR-2026-0001)

### 3. Rendez-vous
- Gestion des rendez-vous
- Création, modification, suppression
- Vérification des chevauchements horaires
- Filtrage par statut et date
- Statuts : prévu, confirmé, annulé, terminé

### 4. Contacts
- Gestion du carnet d'adresses
- Création, modification, suppression
- Types : client, partenaire, fournisseur, personnel, autre
- Recherche et filtrage

### 5. Documents
- Archivage documentaire
- Création, modification, suppression
- Catégorisation
- Statuts : actif, archivé, corbeille

### 6. Rapports
- Statistiques globales
- Statistiques par statut
- Filtre par période
- Impression

### 7. Utilisateurs
- Gestion des utilisateurs
- Création, modification, suppression
- Rôles : admin, assistante, directeur
- Activation/désactivation

### 8. Paramètres
- Informations de l'application
- Création de données de démonstration
- Réinitialisation des données

## Sécurité

- Authentification par session localStorage
- Protection des pages internes
- Redirection automatique vers login si non connecté
- Empêche la suppression de son propre compte

## Données de démonstration

Pour créer des données de test :
1. Se connecter à l'application
2. Aller dans la page "Paramètres"
3. Cliquer sur "Créer" dans la section "Données de démonstration"

## Réinitialisation

Pour réinitialiser toutes les données :
1. Aller dans la page "Paramètres"
2. Cliquer sur "Réinitialiser" dans la section "Gestion des données"
3. Confirmer la suppression

## Design

- Couleur principale : bleu moderne
- Interface responsive
- Sidebar fixe sur desktop
- Menu mobile responsive
- Cartes avec border-radius 2xl
- Ombres douces
- Badges colorés pour les statuts

## Auteur

Version 1.0.0
