# Production Setup Guide - Camino TV

Guide de déploiement en production pour configurer Better Auth avec toutes les fonctionnalités de sécurité.

## 🔴 ÉTAPES CRITIQUES AVANT LE DÉPLOIEMENT

### 1. Générer un secret fort pour Better Auth

**Générez un secret de 32+ caractères** pour `BETTER_AUTH_SECRET` :

```bash
# Méthode 1 : OpenSSL (recommandé)
openssl rand -base64 32

# Méthode 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Méthode 3 : En ligne (https://generate-secret.vercel.app/32)
```

**⚠️ IMPORTANT** : Ce secret doit être :

- Unique pour chaque environnement (dev, staging, prod)
- Stocké de manière sécurisée (Vercel Secrets, .env.local jamais committé)
- Différent de votre DATABASE_URL ou autres secrets

### 2. Configurer l'Email Verification

**Pourquoi activer l'email verification ?**

- ✅ Empêche les inscriptions avec faux emails
- ✅ Protège contre l'usurpation d'identité
- ✅ Réduit le spam et les comptes fantômes
- ✅ Conforme aux bonnes pratiques de sécurité 2025

#### Option A : Resend (Recommandé pour Next.js)

1. **Créer un compte** sur [Resend.com](https://resend.com)
2. **Obtenir votre API Key** dans le dashboard
3. **Vérifier votre domaine** (ou utiliser le domaine de test)
4. **Ajouter les variables d'environnement** :

```env
# Resend Email Service
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
BETTER_AUTH_URL="https://votre-domaine.vercel.app"
NEXT_PUBLIC_APP_URL="https://votre-domaine.vercel.app"
```

5. **Activer dans la config Better Auth** ([lib/auth.ts](src/lib/auth.ts)) :

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // ✅ Activer en production
  sendVerificationEmail: async ({ user, url }) => {
    // Envoyer email avec Resend
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Camino TV <noreply@votre-domaine.com>',
      to: user.email,
      subject: 'Vérifiez votre adresse email',
      html: `
        <h1>Bienvenue sur Camino TV !</h1>
        <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${url}">Vérifier mon email</a>
        <p>Ce lien expire dans 24 heures.</p>
      `,
    })
  },
}
```

6. **Installer Resend** :

```bash
npm install resend
```

#### Option B : Mailgun

```env
MAILGUN_API_KEY="key-xxxxxxxxxxxxxxxxxxxxx"
MAILGUN_DOMAIN="mg.votre-domaine.com"
```

#### Option C : SendGrid

```env
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxx"
```

### 3. Configurer les variables d'environnement Vercel

Dans votre dashboard Vercel (Settings > Environment Variables), ajoutez :

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Better Auth (CRITIQUE)
BETTER_AUTH_SECRET="[VOTRE SECRET GÉNÉRÉ - 32+ chars]"
BETTER_AUTH_URL="https://camino-tv.vercel.app"
NEXT_PUBLIC_APP_URL="https://camino-tv.vercel.app"

# Email Service (Resend recommandé)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
```

### 4. Vérifier la sécurité des cookies

✅ Déjà configuré dans [lib/auth.ts](src/lib/auth.ts:76-82) :

```typescript
cookieOptions: {
  sameSite: 'lax',     // Protection CSRF
  httpOnly: true,      // Protection XSS
  secure: true,        // HTTPS uniquement en production
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 jours
}
```

### 5. Rate Limiting activé

✅ Déjà configuré dans [lib/auth.ts](src/lib/auth.ts:61-66) :

- **10 tentatives maximum par minute** par IP
- Stockage en base de données (PostgreSQL)
- Protection contre les attaques brute-force

## 🟡 CONFIGURATION OPTIONNELLE

### Activer Google OAuth (optionnel)

1. **Créer un projet** dans [Google Cloud Console](https://console.cloud.google.com)
2. **Activer Google+ API**
3. **Créer des OAuth 2.0 credentials**
4. **Authorized redirect URIs** :
   - Dev : `http://localhost:3000/api/auth/callback/google`
   - Prod : `https://camino-tv.vercel.app/api/auth/callback/google`
5. **Copier Client ID + Secret** dans les variables d'environnement

### Configurer les logs de sécurité (recommandé)

Ajoutez un service de monitoring comme [Sentry](https://sentry.io) ou [LogRocket](https://logrocket.com) pour tracker :

- Tentatives de connexion échouées
- Erreurs d'authentification
- Changements de rôle suspects

## 🟢 CHECKLIST DE DÉPLOIEMENT

Avant de déployer en production, vérifiez :

- [ ] `BETTER_AUTH_SECRET` généré avec 32+ caractères aléatoires
- [ ] Email verification activée (`requireEmailVerification: true`)
- [ ] Service email configuré (Resend/Mailgun/SendGrid)
- [ ] `BETTER_AUTH_URL` pointe vers le domaine de production
- [ ] Variables d'environnement Vercel configurées
- [ ] Supabase database URL configurée
- [ ] Migrations Prisma appliquées : `npx prisma migrate deploy`
- [ ] Rate limiting vérifié (10 req/min)
- [ ] Cookies sécurisés activés (`secure: true`)
- [ ] Middleware protège les routes `/admin`
- [ ] Tests de connexion/inscription fonctionnent
- [ ] Email de vérification reçu correctement

## 🔍 TESTER L'EMAIL VERIFICATION

### En développement (sans vrai service email)

Pendant le développement, Better Auth affichera le lien de vérification dans la console :

```bash
[Better Auth] Verification email sent to user@example.com
Verification link: http://localhost:3000/api/auth/verify-email?token=xxxxx
```

Copiez/collez ce lien dans le navigateur pour vérifier l'email.

### En production

1. Créez un compte avec un vrai email
2. Vérifiez votre boîte mail (+ spam/promotions)
3. Cliquez sur le lien de vérification
4. Connexion doit maintenant fonctionner

## 🆘 TROUBLESHOOTING

### Erreur : "Invalid secret"

- Vérifiez que `BETTER_AUTH_SECRET` est bien défini
- Minimum 32 caractères requis
- Redémarrez le serveur après modification

### Emails non reçus

- Vérifiez `RESEND_API_KEY` dans Vercel
- Vérifiez que le domaine est vérifié dans Resend
- Consultez les logs Resend pour voir les erreurs d'envoi

### Rate limit trop strict

- Ajustez `max` dans [lib/auth.ts](src/lib/auth.ts:64) (actuellement 10/min)
- Pour le dev, vous pouvez mettre `max: 100`

### Sessions expirées trop vite

- Vérifiez `expiresIn` dans [lib/auth.ts](src/lib/auth.ts:69) (actuellement 7 jours)
- Vérifiez `updateAge` (actuellement 24h)

## 📚 RESSOURCES

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/guides/authentication)
- [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 🔐 SÉCURITÉ POST-DÉPLOIEMENT

Après le déploiement :

1. **Testez les endpoints protégés** sans authentification → doivent renvoyer 401
2. **Testez le rate limiting** avec 11+ tentatives → doit bloquer
3. **Vérifiez les cookies** dans DevTools → `httpOnly`, `secure`, `sameSite` actifs
4. **Auditez avec** [Observatory](https://observatory.mozilla.org) ou [Security Headers](https://securityheaders.com)
5. **Activez 2FA** pour les comptes admin (future feature)

---

**Besoin d'aide ?** Consultez [CLAUDE.md](CLAUDE.md) pour la documentation technique complète.
