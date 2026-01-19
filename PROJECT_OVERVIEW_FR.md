# Récapitulatif du Projet : SkillFlash Academy

SkillFlash Academy est une plateforme d'apprentissage en ligne moderne conçue pour offrir une expérience éducative interactive et gamifiée.

## 🚀 Stack Technique

Le projet repose sur des technologies de pointe pour assurer performance et maintenabilité :

- **Frontend** : [React](https://reactjs.org/) avec [Vite](https://vitejs.dev/) pour un développement rapide.
- **Langage** : [TypeScript](https://www.typescriptlang.org/) pour une robustesse accrue du code.
- **UI/Design** :
  - [Tailwind CSS](https://tailwindcss.com/) pour le stylisage.
  - [shadcn/ui](https://ui.shadcn.com/) (basé sur [Radix UI](https://www.radix-ui.com/)) pour des composants accessibles et élégants.
  - [Lucide React](https://lucide.dev/) pour l'iconographie.
- **Backend & Base de données** : [Supabase](https://supabase.com/) (PostgreSQL) gérant l'authentification, la base de données et la sécurité (RLS).
- **Gestion des données** : [TanStack Query](https://tanstack.com/query/latest) (React Query) pour la synchronisation des données serveur.

## 🛠️ Fonctionnalités Principales

1. **Catalogue de Cours** : Un espace centralisé pour découvrir les formations disponibles.
2. **Parcours d'Apprentissage** : Navigation structurée par chapitres et modules.
3. **Système de Quiz** :
   - Évaluations à la fin de chaque module.
   - Examens finaux (QCM et Questions à Réponse Ouverte).
4. **Gamification & Progression** :
   - Système de points accumulés par les étudiants.
   - **Leaderboard** (Classement) pour encourager la compétition saine.
   - Suivi précis de la progression par cours.
5. **Certifications** :
   - Génération de certificats lors de la réussite d'un cours.
   - Code de vérification unique pour chaque certificat.
6. **Tableau de Bord Utilisateur** : Vue d'ensemble des cours suivis, des points et de l'activité récente.
7. **Authentification Sécurisée** : Inscription et connexion via Supabase Auth.

## 📊 Structure des Données (Base de Données)

Le schéma Supabase s'articule autour de quatre tables principales :

- **`profiles`** : Stocke les informations utilisateur (nom, avatar, points totaux).
- **`course_progress`** : Suit l'avancement de chaque utilisateur dans les différents cours (chapitres terminés, etc.).
- **`quiz_results`** : Archive les scores et les réponses des utilisateurs aux différents quiz.
- **`certifications`** : Répertorie les certificats délivrés avec leurs codes de vérification.

## 📂 Organisation du Code Source (`src/`)

- **/components** : Composants réutilisables et éléments d'interface (UI).
- **/pages** : Les vues principales de l'application (Auth, Catalog, Course, Dashboard, Leaderboard, Quiz).
- **/hooks** : Logique personnalisée, notamment pour l'authentification et les requêtes de données.
- **/integrations/supabase** : Configuration du client Supabase et définitions des types TypeScript générés.

---

Ce document sert de référence pour comprendre l'état actuel et l'architecture du projet SkillFlash Academy.
