# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Camino TV** is a modern streetwear/sneaker deals platform built with Next.js 15 App Router and React 19. It's a production-ready showcase deployed on Vercel featuring a responsive design system, blog functionality, and a localStorage-based favorites system.

**Live Demo**: https://camino-tv.vercel.app

## Tech Stack

### Frontend

- **Framework**: Next.js 15.5.2 with App Router + Turbopack
- **React**: 19.1.0 (latest stable)
- **TypeScript**: 5.x with strict mode
- **UI Components**: Shadcn UI (24+ components) based on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Theme Management**: next-themes 0.4.6 with dark/light mode
- **Icons**: Lucide React

### Backend

- **Database**: PostgreSQL (Prisma local dev / Supabase production)
- **ORM**: Prisma 6.16.3 with type-safe client
- **Authentication**: Better Auth 1.3.26 with Prisma adapter
- **Validation**: Zod 4.1.5 (forms + API)
- **API**: Next.js Route Handlers (App Router)

### DevOps

- **Testing**: Jest 30 + Testing Library + jsdom
- **Deployment**: Vercel (continuous from main branch)
- **Database Dev**: Prisma local PostgreSQL server

## Common Commands

### Development

```bash
npm run dev              # Start dev server with Turbopack (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint (Next.js config)
```

### Testing

```bash
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Single test**: `npm test -- path/to/test.test.tsx`
**Pattern matching**: `npm test -- --testNamePattern="component name"`

### Database

```bash
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Create and apply migration
npm run db:push          # Push schema without migration
npm run db:studio        # Open Prisma Studio (GUI)
npx prisma dev           # Start local PostgreSQL server
```

## Architecture

### Next.js 15 App Router Structure

```
src/
├── app/
│   ├── (public)/           # Public routes group
│   │   ├── layout.tsx      # Root layout with metadata, fonts, ThemeProvider
│   │   ├── page.tsx        # Home page
│   │   ├── blog/           # Blog with [slug] dynamic routes
│   │   ├── deals/          # Deals catalog
│   │   ├── favorites/      # Favorites wishlist
│   │   ├── team/           # Team profiles
│   │   ├── contact/        # Contact form
│   │   └── legal/          # Legal pages (CGU, etc.)
│   │
│   ├── (auth)/             # Auth routes group (minimal layout)
│   │   ├── layout.tsx      # Auth layout (centered card)
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   │
│   ├── (admin)/            # Admin routes group (protected)
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   └── admin/
│   │       ├── dashboard/  # Dashboard with KPI stats
│   │       ├── deals/      # Deals CRUD management
│   │       ├── blog/       # Blog posts management
│   │       └── users/      # Users administration
│   │
│   └── api/                # API Route Handlers
│       ├── auth/[...all]/  # Better Auth endpoints
│       ├── deals/          # Deals CRUD (GET, POST, PUT, DELETE)
│       └── favorites/      # Favorites management (protected)
│
├── components/
│   ├── ui/                 # 24+ Shadcn UI components
│   ├── admin/              # Admin-specific components (Sidebar, etc.)
│   ├── layout/             # Header, Footer, AuthButton
│   ├── sections/           # Hero, DealsSection
│   ├── demo/               # DealCard, DealGrid
│   ├── blog/               # BlogCard, BlogGrid, TwitterEmbed
│   ├── contact/            # ContactForm with Zod
│   └── providers/          # ThemeProvider
│
├── hooks/
│   └── useFavorites.ts     # Favorites hook (will use API instead of localStorage)
│
├── lib/
│   ├── auth.ts             # Better Auth server config
│   ├── auth-client.ts      # Better Auth React client + useAuth hook
│   ├── db.ts               # Prisma client singleton
│   └── utils.ts            # cn() utility
│
├── types/
│   └── index.ts            # TypeScript interfaces
│
├── data/
│   └── mock.ts             # Mock data (for migration reference)
│
└── middleware.ts           # Next.js middleware (protects /admin routes)

prisma/
├── schema.prisma           # Database schema (User, Deal, Favorite, BlogPost, etc.)
└── migrations/             # Database migrations history
```

### Key Architectural Patterns

**1. Full-Stack Type-Safety**

- Database schema in Prisma → Auto-generated types
- API routes with Zod validation
- Frontend TypeScript interfaces in `src/types/index.ts`
- End-to-end type safety from DB to UI

**2. Authentication & Authorization**

- **Better Auth** for session management
- `useAuth()` hook: `{ user, isAuthenticated, isAdmin, signIn, signOut }`
- Middleware protects `/admin` routes (role-based access)
- Session stored in database (PostgreSQL)

**3. API Layer Architecture**

- RESTful API routes in `app/api/`
- Protected endpoints check session with `auth.api.getSession()`
- Zod schemas validate all input data
- Consistent error responses with status codes

**4. Database Layer (Prisma)**

- Type-safe queries with Prisma Client
- Singleton pattern for client instance (`lib/db.ts`)
- Migrations for schema versioning
- Relations: User → Favorites ← Deal

**5. Component Organization**

- `ui/`: Reusable Shadcn UI components
- `admin/`: Admin-specific components (Sidebar, etc.)
- `layout/`: Shell components (Header with AuthButton)
- Domain components: `demo/`, `blog/`, `sections/`

## Development Guidelines

### Working with Authentication

**Using useAuth hook:**

```tsx
"use client";
import { useAuth } from "@/lib/auth-client";

function MyComponent() {
  const { user, isAuthenticated, isAdmin, signIn, signOut } = useAuth();

  if (!isAuthenticated) return <LoginButton />;

  return <div>Hello {user?.name}</div>;
}
```

**Protecting API Routes:**

```ts
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protected logic here
}
```

### Working with Database (Prisma)

**Query examples:**

```ts
import { prisma } from "@/lib/db";

// Find all active deals
const deals = await prisma.deal.findMany({
  where: { isActive: true },
  orderBy: { createdAt: "desc" },
});

// Create with relations
const favorite = await prisma.favorite.create({
  data: {
    userId: session.user.id,
    dealId: dealId,
  },
  include: { deal: true },
});
```

**Schema changes:**

1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` (creates migration)
3. Prisma Client auto-regenerates with new types

### API Routes Best Practices

**Structure:**

- `GET /api/resource` - List resources
- `POST /api/resource` - Create resource
- `GET /api/resource/:id` - Get single resource
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

**CRITICAL (2025): Multi-layered Security**
Never rely solely on middleware for auth. Always validate in each route:

```ts
import { requireAdmin, requireAuth } from "@/lib/auth-helpers";

// Admin-only endpoint
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request.headers);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }
  const { session } = authResult;
  // ... protected logic
}

// Any authenticated user
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request.headers);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }
  // ... protected logic
}
```

**Validation:**

```ts
const schema = z.object({
  title: z.string().min(10),
  price: z.number().positive(),
});

const validatedData = schema.parse(await request.json());
```

### Adding Shadcn UI Components

```bash
npx shadcn@latest add [component-name]
```

Components installed to `src/components/ui/` with TypeScript + New York style.

### Testing Components

- Tests go in `__tests__` folders or `component.test.tsx` files
- Example: `src/components/ui/__tests__/button.test.tsx`
- Use `@testing-library/react` with `@testing-library/jest-dom` matchers
- Path alias: `@/` maps to `src/`

## Important Configuration Files

### prisma/schema.prisma

- **Database models**: User, Session, Account, Deal, Favorite, BlogPost
- **Enums**: UserRole, DealCategory, BlogCategory
- **Relations**: Properly configured with cascade deletes
- **Indexes**: Optimized for common queries

### middleware.ts

- **Route protection**: Guards `/admin/*` routes
- **Session check**: Uses Better Auth's betterFetch
- **Role validation**: Ensures user.role === 'ADMIN'
- **Redirects**: Unauthorized → `/login?redirect=...`

### lib/auth.ts

- **Better Auth server config**
- **Prisma adapter** for database sessions
- **Providers**: Email/password + Google OAuth (optional)
- **Session duration**: 7 days with 24h refresh

### lib/auth-client.ts

- **React client** for Better Auth
- **useAuth() hook**: Clean API for auth state
- **Auto-refresh**: Session updates automatically

### next.config.ts

- **Security headers**: CSP, X-Frame-Options, HSTS
- **Prisma generate**: Runs before build
- **Instagram embeds**: Allowed in CSP

### tailwind.config.ts

- **darkMode**: `'class'` (controlled by next-themes)
- **Brand colors**: `brand.50` to `brand.950` (red palette)
- **CSS variables**: All Shadcn colors use HSL vars

### .env.example

- Template for required environment variables
- **DATABASE_URL**: Pooled connection (Supabase)
- **DIRECT_URL**: Direct connection for migrations
- **BETTER_AUTH_SECRET**: Min 32 chars for production
- **Google OAuth** credentials (optional)

## Deployment

### Vercel Setup

1. **Environment Variables** (add in Vercel dashboard):

   - `DATABASE_URL` - Supabase connection string
   - `DIRECT_URL` - Supabase direct connection
   - `BETTER_AUTH_SECRET` - Random 32+ char string
   - `BETTER_AUTH_URL` - Your production URL
   - `NEXT_PUBLIC_APP_URL` - Same as above
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (if using OAuth)

2. **Build command**: `npm run build` (includes `prisma generate`)

3. **Auto-deploy**: Pushes to `main` branch trigger deployment

### Database Setup (Supabase)

1. Create project on Supabase
2. Copy connection strings to Vercel env vars
3. Run migrations: `npx prisma migrate deploy` (or auto on deploy)

## Key Integration Points

### Blog System

- Dynamic routes: `app/blog/[slug]/page.tsx`
- Posts indexed in `src/data/mock.ts` with `slug` matching route param
- Not-found handling: `app/blog/[slug]/not-found.tsx`
- Category filtering available in BlogPost interface

### Deals System

- Main catalog: `app/deals/page.tsx`
- DealCard component handles favorite toggle + external links
- Categories: 'sneakers' | 'streetwear' | 'accessories' | 'electronics' | 'lifestyle'
- Filtering state managed locally in deals page

### Contact Form

- Located: `src/components/contact/contact-form.tsx`
- Validation: Zod schemas with TypeScript inference
- Client-side validation with error messages
- Form submission: Currently console.log (ready for API integration)

## API Endpoints

### Authentication (Better Auth)

- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/sign-in/social` - OAuth login (Google)

### Deals (Public + Protected)

- `GET /api/deals` - List deals (public, supports ?category, ?limit, ?offset)
- `GET /api/deals/:id` - Get single deal (public)
- `POST /api/deals` - Create deal (admin only)
- `PUT /api/deals/:id` - Update deal (admin only)
- `DELETE /api/deals/:id` - Soft delete deal (admin only)

### Favorites (Protected)

- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites (body: { dealId })
- `DELETE /api/favorites?dealId=xxx` - Remove from favorites

## Admin Dashboard

### Access

- URL: `/admin/dashboard`
- Protected by middleware (requires `role: 'ADMIN'`)
- Redirects to `/login` if not authenticated

### Features

- **Dashboard**: KPI stats (deals count, users, favorites, engagement)
- **Deals Management**: CRUD interface (to be fully implemented)
- **Blog Management**: Article editor (to be implemented)
- **Users Management**: User administration (to be implemented)

### Layout

- Responsive Shadcn Sidebar with collapsible navigation
- Breadcrumb navigation
- User dropdown with logout

## Security Architecture

### Multi-Layered Authentication (2025 Best Practices)

**Critical Security Features:**

1. **Rate Limiting**: 10 requests/min per IP (prevents brute-force attacks)
2. **Secure Cookies**: `httpOnly`, `secure`, `sameSite: lax` (prevents XSS/CSRF)
3. **Password Policies**: 8+ chars, uppercase, lowercase, number, special char
4. **Common Password Blocking**: Detects weak passwords
5. **Multi-layer Auth**: Middleware + API route validation (defense in depth)

**Auth Helpers** ([lib/auth-helpers.ts](src/lib/auth-helpers.ts)):

- `requireAuth(headers)` - Require any authenticated user
- `requireAdmin(headers)` - Require ADMIN role
- `requireOwnerOrAdmin(headers, resourceUserId)` - Require resource owner or admin

**Security Checklist:**

- ✅ Rate limiting enabled (10 req/min)
- ✅ Cookies secured (httpOnly, secure, sameSite)
- ✅ Password validation (strong requirements)
- ✅ Multi-layer auth (middleware + route-level)
- ✅ Zod validation on all API inputs
- ⚠️ Email verification (disabled in dev, enable in prod)
- ⚠️ BETTER_AUTH_SECRET must be 32+ random chars in prod

**Production Deployment:**
See [PRODUCTION-SETUP.md](PRODUCTION-SETUP.md) for:

- Email verification setup (Resend/Mailgun/SendGrid)
- Secret generation (`openssl rand -base64 32`)
- Environment variables configuration
- Security testing checklist

## Notes

- **Images**: Store in `public/` or use cloud storage (Vercel Blob, Cloudinary)
- **Fonts**: Geist Sans + Geist Mono via next/font (self-hosted)
- **Migration**: Mock data → Database (create `prisma/seed.ts` for seeding)
- **SEO**: Sitemap, robots.txt, OpenGraph metadata
- **Security**: See Security Architecture section above
