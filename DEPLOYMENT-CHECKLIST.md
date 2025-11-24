# 🚀 Checklist de Déploiement en Production - Camino TV

**Date de dernière mise à jour** : Janvier 2025
**Pour** : Équipe Camino
**Environnement cible** : Vercel + Supabase

---

## 📋 AVANT DE COMMENCER

### Prérequis

- [ ] Compte Vercel créé (vercel.com)
- [ ] Projet Supabase créé (supabase.com)
- [ ] Domaine personnalisé configuré (optionnel mais recommandé)
- [ ] Accès au repository GitHub du projet

---

## 🔴 ÉTAPE 1 : CONFIGURATION SUPABASE (CRITIQUE)

### 1.1 - Créer le projet Supabase

- [ ] Se connecter à [supabase.com](https://supabase.com)
- [ ] Créer un nouveau projet
- [ ] Choisir une région proche de vos utilisateurs (eu-central-1 pour l'Europe)
- [ ] Définir un mot de passe fort pour la base de données (noter dans un gestionnaire de mots de passe)

### 1.2 - Configurer la base de données PostgreSQL

- [ ] Aller dans `Settings > Database`
- [ ] Copier la **Connection string** (pooled - avec pgbouncer) → `DATABASE_URL`
- [ ] Copier la **Direct connection** (sans pooler) → `DIRECT_URL`

### 1.3 - Récupérer les clés API

- [ ] Aller dans `Settings > API`
- [ ] Copier `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copier `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copier `service_role` key (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

### 1.4 - Configurer Supabase Storage

- [ ] Aller dans `Storage` dans le menu latéral
- [ ] Créer un bucket nommé **`camino-tv`**
- [ ] Bucket type : **Public** (pour accès direct aux images)
- [ ] Allowed MIME types : `image/jpeg, image/png, image/webp`
- [ ] Max file size : 5 MB

### 1.5 - Appliquer les migrations Prisma

```bash
# En local d'abord pour tester
npx prisma migrate deploy

# Vérifier que toutes les tables sont créées
npx prisma studio
```

- [ ] Vérifier que les tables existent : `User`, `Session`, `Account`, `Deal`, `Favorite`, `BlogPost`, `Verification`

---

## 🟡 ÉTAPE 2 : GÉNÉRER LES SECRETS DE SÉCURITÉ

### 2.1 - Générer BETTER_AUTH_SECRET

```bash
# Méthode 1 (OpenSSL - recommandé)
openssl rand -base64 32

# Méthode 2 (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

- [ ] Copier le secret généré
- [ ] **IMPORTANT** : Ne JAMAIS commiter ce secret dans git
- [ ] Utiliser un gestionnaire de mots de passe pour le stocker

### 2.2 - Vérifier tous les secrets nécessaires

- [ ] `BETTER_AUTH_SECRET` (32+ caractères)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (secret, ne jamais exposer côté client)
- [ ] `DATABASE_URL` (connection pooled)
- [ ] `DIRECT_URL` (pour migrations)

---

## 🟢 ÉTAPE 3 : CONFIGURATION VERCEL

### 3.1 - Déployer le projet sur Vercel

- [ ] Se connecter à [vercel.com](https://vercel.com)
- [ ] `Import Git Repository`
- [ ] Sélectionner le repository GitHub `camino-tv`
- [ ] Framework Preset : **Next.js** (détecté automatiquement)
- [ ] Build Command : `npm run build` (déjà configuré)
- [ ] Output Directory : `.next` (par défaut)

### 3.2 - Configurer les variables d'environnement

Aller dans `Settings > Environment Variables` et ajouter **TOUTES** les variables suivantes :

#### Base de données

```
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres
```

#### Supabase Storage

```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Better Auth

```
BETTER_AUTH_SECRET=[VOTRE SECRET GÉNÉRÉ - 32+ chars]
BETTER_AUTH_URL=https://camino-tv.vercel.app
NEXT_PUBLIC_APP_URL=https://camino-tv.vercel.app
```

#### Email (si vous activez la vérification email)

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

#### Google OAuth (optionnel)

```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**Important** :

- [ ] Vérifier que toutes les variables sont en **Production**, **Preview** ET **Development**
- [ ] Pas d'espaces avant/après les `=`
- [ ] Pas de guillemets autour des valeurs

### 3.3 - Déclencher le déploiement

- [ ] Cliquer sur `Deployments > Redeploy`
- [ ] Attendre la fin du build (environ 2-3 minutes)
- [ ] Vérifier qu'il n'y a pas d'erreurs dans les logs

---

## 🔧 ÉTAPE 4 : SEEDING DE LA BASE DE DONNÉES

### 4.1 - Seed des données initiales

```bash
# En local, connecté à la DB de production
npm run db:seed
```

Cela va créer :

- [ ] Utilisateur admin : `admin@camino-tv.com` / `Admin123!@#`
- [ ] Utilisateur démo : `demo@camino-tv.com` / `Admin123!@#`
- [ ] 5 deals d'exemple
- [ ] 2 articles de blog

**⚠️ IMPORTANT** : Changez immédiatement les mots de passe après le premier login !

### 4.2 - Vérifier les données

- [ ] Ouvrir Prisma Studio : `npx prisma studio`
- [ ] Vérifier que les tables ont des données
- [ ] Tester la connexion admin sur le site

---

## 🔐 ÉTAPE 5 : SÉCURITÉ FINALE

### 5.1 - Activer l'email verification (recommandé)

- [ ] Créer un compte [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois)
- [ ] Obtenir l'API key
- [ ] Ajouter `RESEND_API_KEY` dans Vercel env vars
- [ ] Modifier `src/lib/auth.ts` ligne 25 : `requireEmailVerification: true`
- [ ] Redéployer

### 5.2 - Vérifier les headers de sécurité

Tester avec [securityheaders.com](https://securityheaders.com) :

- [ ] X-Frame-Options: DENY ✅
- [ ] X-Content-Type-Options: nosniff ✅
- [ ] Strict-Transport-Security ✅
- [ ] Content-Security-Policy ✅

### 5.3 - Tester le rate limiting

- [ ] Essayer de se connecter 11 fois avec un mauvais mot de passe
- [ ] Vérifier que la 11ème tentative est bloquée (rate limit actif)

### 5.4 - Vérifier les cookies

Ouvrir DevTools > Application > Cookies sur votre site :

- [ ] Cookies Better Auth présents
- [ ] Attribut `HttpOnly` : ✅
- [ ] Attribut `Secure` : ✅
- [ ] Attribut `SameSite` : Lax ✅

---

## ✅ ÉTAPE 6 : TESTS DE PRODUCTION

### 6.1 - Tests fonctionnels

- [ ] **Page d'accueil** charge correctement
- [ ] **Deals** s'affichent avec images
- [ ] **Blog** articles accessibles
- [ ] **Inscription** fonctionne (email de vérification si activé)
- [ ] **Login** fonctionne
- [ ] **Upload d'image** fonctionne (admin)
- [ ] **Favoris** sauvegardent correctement
- [ ] **Dark mode** fonctionne
- [ ] **Navigation** entre pages fluide

### 6.2 - Tests de sécurité

- [ ] Accéder à `/admin` sans login → redirige vers `/login`
- [ ] Accéder à `/admin` avec compte USER → redirige vers `/`
- [ ] Accéder à `/admin` avec compte ADMIN → affiche le dashboard
- [ ] Appeler `/api/deals` (POST) sans auth → retourne 401
- [ ] Upload un fichier > 5MB → retourne erreur 400
- [ ] Upload un fichier .exe → retourne erreur 400

### 6.3 - Tests de performance

- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.9s

### 6.4 - Tests SEO

- [ ] Sitemap accessible : `https://camino-tv.vercel.app/sitemap.xml`
- [ ] Robots.txt accessible : `https://camino-tv.vercel.app/robots.txt`
- [ ] Meta tags OpenGraph présents sur chaque page
- [ ] Images ont des attributs `alt`
- [ ] Titres de page uniques et descriptifs

---

## 📱 ÉTAPE 7 : RESPONSIVE & CROSS-BROWSER

### 7.1 - Tests responsive

- [ ] Mobile (375px - iPhone SE)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1920px)
- [ ] Navigation burger sur mobile
- [ ] Images responsive

### 7.2 - Tests navigateurs

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Safari iOS
- [ ] Chrome Android

---

## 🎯 ÉTAPE 8 : MONITORING & ANALYTICS (Optionnel)

### 8.1 - Activer Vercel Analytics

- [ ] Dans Vercel dashboard > Analytics
- [ ] Activer Web Analytics (gratuit)
- [ ] Activer Speed Insights (gratuit)

### 8.2 - Configurer Sentry (erreurs en production)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

- [ ] Créer compte Sentry
- [ ] Configurer DSN
- [ ] Tester capture d'erreur

### 8.3 - Google Analytics (optionnel)

- [ ] Créer propriété GA4
- [ ] Ajouter `NEXT_PUBLIC_GA_ID` dans env vars
- [ ] Installer Google Analytics component

---

## 📚 ÉTAPE 9 : DOCUMENTATION & HANDOFF

### 9.1 - Préparer la documentation pour l'équipe Camino

- [ ] Lire [CLAUDE.md](CLAUDE.md) - Architecture du projet
- [ ] Lire [PRODUCTION-SETUP.md](PRODUCTION-SETUP.md) - Setup détaillé
- [ ] Lire [README.md](README.md) - Guide de démarrage

### 9.2 - Credentials à fournir

Créer un document sécurisé (1Password, Bitwarden) avec :

- [ ] URL de production
- [ ] Credentials admin (à changer immédiatement)
- [ ] Accès Vercel dashboard (inviter l'équipe)
- [ ] Accès Supabase dashboard (inviter l'équipe)
- [ ] Variables d'environnement sensibles

### 9.3 - Formation rapide

- [ ] Comment créer un deal (admin panel)
- [ ] Comment uploader une image
- [ ] Comment publier un article de blog
- [ ] Comment gérer les utilisateurs

---

## 🐛 ÉTAPE 10 : POST-DÉPLOIEMENT

### 10.1 - Premiers 24h

- [ ] Surveiller les logs Vercel pour erreurs
- [ ] Vérifier les métriques (traffic, erreurs)
- [ ] Tester toutes les fonctionnalités une dernière fois

### 10.2 - Première semaine

- [ ] Récolter feedback des utilisateurs
- [ ] Monitorer la performance
- [ ] Vérifier que les emails de vérification sont bien envoyés
- [ ] Ajuster le rate limiting si nécessaire

### 10.3 - Maintenance continue

- [ ] Mettre à jour les dépendances régulièrement (`npm outdated`)
- [ ] Surveiller les CVE de sécurité (GitHub Dependabot)
- [ ] Backup régulier de la base de données Supabase

---

## 🆘 TROUBLESHOOTING COURANT

### Problème : Build échoue sur Vercel

**Solution** :

1. Vérifier que toutes les env vars sont définies
2. Vérifier que `DATABASE_URL` et `DIRECT_URL` sont corrects
3. Check build logs : `Vercel > Deployments > Build Logs`

### Problème : "Missing Supabase environment variables"

**Solution** :

1. Vérifier que `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` sont bien définis
2. Redéployer après ajout des variables

### Problème : Upload d'images ne fonctionne pas

**Solution** :

1. Vérifier que le bucket `camino-tv` existe dans Supabase Storage
2. Vérifier que le bucket est **Public**
3. Vérifier les permissions du bucket
4. Vérifier CSP dans `next.config.ts` autorise `*.supabase.co`

### Problème : Rate limiting trop strict

**Solution** :

1. Modifier `max` dans `src/lib/auth.ts` ligne 64
2. Augmenter de 10 à 20 ou 30 si nécessaire
3. Redéployer

### Problème : Emails de vérification non reçus

**Solution** :

1. Vérifier `RESEND_API_KEY` dans env vars
2. Vérifier domaine vérifié dans Resend
3. Consulter logs Resend dashboard
4. Vérifier spam/promotions

---

## ✨ CHECKLIST FINALE (RÉCAPITULATIF)

### Configuration

- [x] Supabase projet créé avec PostgreSQL
- [x] Supabase Storage bucket `camino-tv` créé (public)
- [x] Toutes les clés API Supabase copiées
- [x] `BETTER_AUTH_SECRET` généré (32+ chars)
- [x] Variables d'environnement ajoutées dans Vercel

### Déploiement

- [x] Projet déployé sur Vercel
- [x] Build réussi sans erreurs
- [x] Migrations Prisma appliquées
- [x] Seeding effectué (admin + demo users + data)

### Sécurité

- [x] Rate limiting activé (10 req/min)
- [x] Cookies sécurisés (httpOnly, secure, sameSite)
- [x] Headers de sécurité configurés
- [x] CSP configuré
- [x] Routes admin protégées
- [x] Email verification activée (optionnel mais recommandé)

### Tests

- [x] Fonctionnalités principales testées
- [x] Sécurité testée
- [x] Performance testée (Lighthouse)
- [x] SEO vérifié (sitemap, robots.txt)
- [x] Responsive testé

### Documentation

- [x] Credentials partagés de manière sécurisée
- [x] Équipe Camino formée
- [x] Monitoring activé

---

## 🎉 DÉPLOIEMENT TERMINÉ !

Si toutes les cases sont cochées, **Camino TV est prêt pour la production** ! 🚀

**Prochaines étapes** :

1. Annoncer le lancement
2. Monitorer les premiers utilisateurs
3. Récolter feedback et itérer

**Support** :

- Documentation : [CLAUDE.md](CLAUDE.md)
- Setup : [PRODUCTION-SETUP.md](PRODUCTION-SETUP.md)
- Issues GitHub : [github.com/camino-tv/issues](https://github.com)

---

**Version** : 1.0
**Dernière mise à jour** : Janvier 2025
**Auteur** : Équipe Technique Camino TV
