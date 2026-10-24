# AI Meeting → Execution Web

Frontend repository for the AI Meeting → Execution product. It will provide the user experience for authentication, workspaces, meetings, review, tasks, settings, and integrations. It is intended to deploy independently from the API.

## Authentication implementation

The initial web application implements the API-owned authentication experience: registration and email OTP, local and Google/Microsoft sign-in, password recovery/reset, account settings, explicit identity linking/unlinking, session revocation, sign-out, account disablement, deletion requests, and email-change confirmation.

## Frontend stack

The web app uses Next.js App Router, React, TypeScript, Tailwind CSS, React Hook Form, and Zod. Custom page styling belongs in scoped SCSS modules. The small `components/ui` layer uses semantic native controls with composable variants in the shadcn/ui style. The API is deployed and verified before production web integration.

## Repository boundaries

- The web client consumes the backend public API through `NEXT_PUBLIC_API_URL`; production uses a same-origin Next.js rewrite to keep session cookies first-party.
- Do not hardcode API URLs or connect directly to the backend database.
- The backend API base path is planned as `/api/v1`; the backend owns the API contract and OpenAPI documentation.
- For local development, set `NEXT_PUBLIC_API_URL` to `http://localhost:3001/api/v1`. For Vercel, set `NEXT_PUBLIC_API_URL=/api/v1` and `API_PROXY_ORIGIN=https://<api-project>.vercel.app`.

## Local setup and commands

Use Node.js 22 or newer with pnpm 11.25.0. Enable Corepack, install dependencies, copy `.env.example` to `.env.local`, and run the development server:

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The API's `WEB_ORIGINS` must include the exact web origin (normally `http://localhost:3000`). The browser calls the API with credentialed requests and obtains a CSRF token before each mutation. Session cookies remain HttpOnly and owned by the API; provider and session secrets are not stored in browser storage.

Available checks:

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

Copy `.env.example` to `.env.local` for local development. Never commit local environment files or credentials.

## Zero-cost personal deployment

Deploy the API first to Vercel Hobby and connect it to Supabase Free PostgreSQL. The API repository README lists the required server secrets, Auth0 callback setup, pooled database URLs, migration step, and free-tier limits. Vercel Hobby is limited to personal, non-commercial use. Supabase Free may pause after a week of low activity, is limited to 500 MB, and has no automatic database backups. Treat this as a personal/demo deployment, keep recoverable backups outside the free database, and do not store data that requires production availability or recovery guarantees.

After the API is ready, deploy this repository as a separate Vercel project. Set `API_PROXY_ORIGIN` to the API's Vercel origin and `NEXT_PUBLIC_API_URL=/api/v1`. Register `<web-origin>/api/v1/auth/oidc/callback` with Auth0 and set the API's `WEB_ORIGINS`, `PASSWORD_RESET_URL`, and `EMAIL_CHANGE_URL` to the web origin. The rewrite keeps API calls and OIDC callback on the web origin, so the API's `HttpOnly`, `Secure`, `SameSite=Lax`, host-only cookies work without a paid custom domain.

## Development workflow

Follow the canonical constitution and approved specifications in the sibling `meeting-execution-specs` repository. The backend owns the API contract; the web client consumes it through `NEXT_PUBLIC_API_URL`. Open `AI-Meeting-Execution.code-workspace` to work with all three independent repositories. Resolve specification conflicts explicitly before changing architecture or behavior.
