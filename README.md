# SkillFlash Academy ⚡

SkillFlash est une plateforme d'apprentissage moderne, rapide et gamifiée, conçue pour offrir une expérience éducative premium et interactive.

## 🚀 Stack Technique

### Frontend

- **Framework** : React 18 avec Vite pour un rechargement instantané.
- **Langage** : TypeScript pour un typage strict et une maintenance aisée.
- **Styles** : Tailwind CSS avec des animations personnalisées (`tailwindcss-animate`).
- **UI Components** : Shadcn UI (basé sur Radix UI).
- **Icônes** : Lucide React.

### État & Backend

- **Authentification** : Supabase Auth (Email/Password).
- **Data Fetching** : TanStack Query (React Query) pour la gestion du cache et des états de chargement.
- **Stockage Local** : Gestion de la progression et des profils via `localStorage` avec synchronisation réactive.

### Utilitaires de Données

- **PDF** : `jsPDF` pour la génération de certificats.
- **QR Code** : `qrcode.react` pour la validation externe.
- **Validation** : Zod pour les schémas de données.

---

## 🏗️ Architecture du Projet

```text
├── public/                 # Assets statiques et Données
│   ├── courses/            # JSON/Markdown des cours
│   └── tests/              # Bases de données des quiz (QCM/QR)
├── src/
│   ├── components//        # Composants réutilisables
│   │   ├── ui/             # Composants de base Shadcn
│   │   └── landing/        # Sections de la page d'accueil
│   ├── hooks/              # Logique métier (useAuth, useProgress)
│   ├── lib//               # Clients et utilitaires (Supabase, PDF)
│   ├── pages/              # Vues (Dashboard, Catalog, Course, Quiz)
│   └── types/              # Interfaces TypeScript globales
└── vercel.json             # Configuration pour le déploiement Vercel
```

---

## 📖 Guide par l'Exemple (Documentation Technique)

Cette section détaille comment le contenu est structuré pour permettre une extension facile de la plateforme.

### 1. Définition d'un Cours (`public/courses/index.json`)

C'est le catalogue central. Chaque objet définit une carte de cours.

```json
{
  "id": "python",
  "title": "Python Intro",
  "description": "Introduction à Python pour le scripting.",
  "category": "development",
  "icon": "Terminal",
  "color": "python",
  "duration": "2 heures",
  "difficulty": "Débutant",
  "chapters": 10,
  "totalQuestions": 10
}
```

### 2. Structure des Chapitres (`public/courses/[id]/chapters.json`)

Définit la liste des modules d'un cours spécifique.

```json
{
  "courseId": "python",
  "chapters": [
    {
      "id": 1,
      "title": "Introduction & Syntaxe",
      "description": "Premiers pas avec Python.",
      "duration": "60 min"
    }
  ]
}
```

### 3. Format des Quiz QCM (`public/tests/qcm/[id]_qcm.json`)

```json
{
  "title": "Expertise Python",
  "passingScore": 70,
  "questions": [
    {
      "id": 1,
      "question": "Quel mot-clé est utilisé pour créer une fonction ?",
      "options": ["func", "def", "function"],
      "correctAnswer": 1,
      "explanation": "Le mot-clé 'def' est utilisé pour définir une fonction."
    }
  ]
}
```

### 4. Format des Quiz QR (`public/tests/qr/[id]_qr.json`)

```json
{
  "title": "Logique Python Avancée",
  "questions": [
    {
      "id": 1,
      "question": "Pourquoi utiliser 'with' pour ouvrir un fichier ?",
      "expectedKeywords": ["fermeture", "automatique", "sécurité"],
      "sampleAnswer": "Il garantit que le fichier est fermé automatiquement."
    }
  ]
}
```

---

## ✨ Fonctionnalités Avancées

### Gamification & Points

- **Quizz Réussis** : +50 points.
- **Chapitres Complétés** : +10 points.
- **Classement** : Mise à jour réactive des scores dans le Leaderboard via le hook `useProfile`.

### Certifications Statistiques

Le système génère un certificat PDF incluant :

- Le score final.
- Un QR Code unique encodant les données (Nom, Cours, Date, ID).
- Une URL de vérification dynamique : `/verify?d=[BASE64_DATA]`.

### Mode Hors-ligne & Résilience

- La progression est sauvegardée localement.
- Un `ErrorBoundary` global capture les erreurs inattendues pour éviter les écrans blancs.

---

## 🛠️ Installation & Développement

### 1. Installation

```bash
npm install
```

### 2. Scripts Disponibles

- `npm run dev` : Lance le serveur de dev.
- `npm run build` : Génère le bundle de production.
- `npm run test` : Exécute les tests unitaires via Vitest.
- `npm run lint` : Vérifie la qualité du code.

---

## 📄 Licence & Crédits

Développé par **SkillFlash Team**. Tous droits réservés.
Documentation générée pour la version test avant backend
