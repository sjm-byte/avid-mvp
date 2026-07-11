# Deployment — ParsPack (آوید MVP)

Next.js 15 production app. Demo mode works without Supabase; optional env vars enable real auth.

## package.json scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Build | `npm run build` | Production build (`.next`) |
| Start | `npm run start` | Serve on port **3000** |
| Dev | `npm run dev` | Local development only |

## ParsPack — Node.js app (recommended)

1. Create a **Node.js** application in ParsPack panel.
2. Connect the Git repository (or upload the project).
3. Set **Node version** to **20** (or 18+).
4. Install dependencies:

```bash
npm ci
```

5. **Build command:**

```bash
npm run build
```

6. **Start command:**

```bash
npm run start
```

7. **Port:** `3000`  
   Map the ParsPack public port / reverse proxy to container/app port **3000**.

8. Set environment variables in the ParsPack panel (see below). Do **not** commit secrets.

9. Deploy / restart the app and open the public URL.

### Optional: Docker on ParsPack

If the panel supports Docker:

```bash
docker build -t avid-mvp .
docker run -p 3000:3000 --env-file .env.production avid-mvp
```

Use panel env vars instead of a committed `.env` file. Never put real keys in the image.

## Environment variables

Copy from `.env.local.example`. Set these in ParsPack **Environment** (not in git):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon (public) key |
| `PORT` | Optional | Default `3000` |
| `NODE_ENV` | Auto | Set to `production` by host / Docker |
| `HOSTNAME` | Optional | Docker uses `0.0.0.0` so the app listens externally |

Without Supabase vars, the app runs in **demo mode** (cookie-based mock login).

**Do not** add service-role keys, database passwords, or other secrets to the repo or `DEPLOYMENT.md`.

## Checklist before go-live

- [ ] `npm run build` succeeds locally
- [ ] Build command = `npm run build`
- [ ] Start command = `npm run start`
- [ ] Port = `3000`
- [ ] Env vars set in panel (or demo-only with no Supabase)
- [ ] No `.env.local` / secrets committed
- [ ] Public URL loads `/` and `/login` (demo login works)

## Local verify

```bash
npm ci
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).
