# HeriVest

A crowdfunding site for wildlife and nature conservation projects in Vietnam.

**Live:** https://herivest.com

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routes in `src/routes`)
- Tailwind CSS v4 and shadcn/ui components
- Supabase for auth and data (`src/integrations/supabase`, migrations in `supabase/migrations`)
- AI chat guide "Sao" via the Vercel AI SDK and Vercel AI Gateway (`src/routes/api/chat.ts`)
- Donations through PayPal and VNPay
- Hosted on Vercel; Nitro builds the server output

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev
```

The dev server runs on http://localhost:8080.

## Environment variables

Public (also in `.env`):

| Name | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL`, `SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

Server-only secrets (set in Vercel, never commit):

| Name | Purpose |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access for server functions and the chat guide |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | PayPal REST app credentials |
| `PAYPAL_ENV` | `live` for real payments; anything else uses the PayPal sandbox |
| `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_PAY_URL` | VNPay merchant settings |
| `AI_GATEWAY_API_KEY` | Only needed outside Vercel; on Vercel the AI Gateway uses the deployment's OIDC token |
| `DATABASE_URL` | Postgres connection string for `drizzle-kit` |

## Deploy

Pushing to `main` deploys to production on Vercel.
