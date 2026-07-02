# Call Tracker

App indépendante (Next.js 15 + Supabase) pour suivre le nombre d'appels et de no-show, à partir des événements Google Calendar qui ont un lien Google Meet. Le no-show est coché manuellement — pas de détection automatique.

Vit dans le monorepo WS26 mais a son propre `package.json`, sa propre base Supabase et son propre déploiement Vercel (Root Directory: `call-tracker`).

## 1. Créer un projet Supabase dédié

Sur [supabase.com](https://supabase.com), crée un nouveau projet (ne réutilise pas celui de l'app AssoConnect). Récupère :
- l'URL du projet et la `service_role` key (Project Settings → API) → `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- la référence du projet (dans l'URL du dashboard) → `SUPABASE_PROJECT_REF`
- un access token personnel ([supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)) → `SUPABASE_ACCESS_TOKEN`

`npm run build` applique automatiquement les migrations SQL de `supabase/migrations/` via ces deux dernières variables.

## 2. Créer un client OAuth Google

Dans [Google Cloud Console](https://console.cloud.google.com/) :
1. Crée un projet (ou réutilise un projet perso existant).
2. Active l'**API Google Calendar** (APIs & Services → Library).
3. Configure l'écran de consentement OAuth (type "Externe" fonctionne pour un usage perso, pas besoin d'être Google Workspace).
4. Crée un identifiant OAuth de type "Application Web" (APIs & Services → Credentials). Ajoute comme URI de redirection autorisée :
   - `http://localhost:3000/api/auth/google/callback` en local
   - `https://<ton-domaine-vercel>/api/auth/google/callback` en production
5. Récupère le Client ID et le Client Secret → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, et renseigne `GOOGLE_REDIRECT_URI` avec l'URI correspondant à l'environnement.

## 3. Variables d'environnement

Copie `.env.example` vers `.env.local` et remplis toutes les valeurs, y compris `APP_PASSWORD` (un mot de passe de ton choix qui protège le dashboard, aucune autre auth n'est en place).

## 4. Lancer en local

```bash
npm install
npm run dev
```

Ouvre `http://localhost:3000`, entre ton mot de passe, puis va sur `/api/auth/google` pour connecter ton compte Google (une seule fois — le refresh token est stocké en base). Reviens sur `/` et clique sur "Synchroniser".

## 5. Déployer sur Vercel

Crée un nouveau projet Vercel pointant sur ce repo avec **Root Directory** = `call-tracker`. Renseigne toutes les variables de `.env.example` dans les Environment Variables du projet Vercel (avec l'URL de production pour `GOOGLE_REDIRECT_URI`, et pense à ajouter cette URI côté Google Cloud Console aussi).

## Prochaines étapes (non incluses dans ce MVP)

- **HubSpot** : rattacher chaque appel à un contact/deal HubSpot (`hubspot_contact_id` existe déjà en base, prêt à être rempli).
- **Claap** : recevoir le webhook "recording added" de Claap et remplir `claap_recording_url` sur l'appel correspondant.
