# Deploy & Secrets — quick guide

This repository already contains a GitHub Actions workflow that builds the site and (optionally) publishes to Cloudflare Pages.

## Required repo secrets
Add these in GitHub → Settings → Secrets and variables → Actions:

- `VITE_SUPABASE_URL` = https://<your-project>.supabase.co
- `VITE_SUPABASE_ANON_KEY` = <anon-public-key>

Optional (only if you want Actions to publish to Cloudflare Pages):
- `CLOUDFLARE_API_TOKEN` = token with **Pages:Edit** (use minimal scope)
- `CLOUDFLARE_PAGES_PROJECT_NAME` = `ad-finem-web`

## Steps (UI)
1. Revoke any exposed Cloudflare tokens immediately: Cloudflare → My Profile → API Tokens → Revoke.
2. Create a new token using the **Edit Cloudflare Pages** template (or custom with `Pages:Edit`).
3. Copy the token (shown once) and add it as `CLOUDFLARE_API_TOKEN` in GitHub Secrets.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to GitHub Secrets.
5. Go to GitHub → Actions → select `CI / Deploy to Cloudflare Pages` → **Run workflow** (or push to `main`).

## Steps (CLI)
- Requires `gh` authenticated and `curl`.

1) Revoke token (if exposed):

```bash
./scripts/revoke-cloudflare-token.sh <EXPOSED_TOKEN>
```

2) Create secrets locally (example):

```bash
export VITE_SUPABASE_URL="https://xfjcgrzhaeexhazvzqqs.supabase.co"
export VITE_SUPABASE_ANON_KEY="<anon-key>"
export CLOUDFLARE_API_TOKEN="<new-cloudflare-token>"  # optional
./scripts/gh-set-secrets.sh
```

3) Trigger a manual build:
- GitHub Actions → CI / Deploy to Cloudflare Pages → Run workflow
- Or push to `main`: `git push origin main`

## Verify deployment
- Check GitHub Actions logs for the `build-and-deploy` job. If `Publish to Cloudflare Pages` runs, verify the Pages site.

## Security notes
- Use ANON key only in client-side code. Never expose service_role key.
- Limit Cloudflare token scope to Pages operations and set expiration.
- Rotate keys if accidentally exposed.

---
If you want, I can:
- walk you step-by-step while you create the Cloudflare token, or
- set the GitHub secrets *for you* if you provide a short-lived GitHub PAT with `repo` and `secrets` permissions (not recommended to paste here).