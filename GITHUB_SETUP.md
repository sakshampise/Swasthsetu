# Push this to GitHub

This folder is already a **committed git repository** (run `git log` to see the initial commit). You just need to create an empty repo on GitHub and push to it.

## Option A — GitHub CLI (fastest)

If you have the [`gh` CLI](https://cli.github.com/):

```bash
cd swasthsetu-ai
gh repo create swasthsetu-ai --public --source=. --remote=origin --push
```

That creates the repo and pushes in one command. Done.

## Option B — Web + git

1. Go to [github.com/new](https://github.com/new), name it `swasthsetu-ai`, **don't** add a README/.gitignore (this repo already has them), click **Create repository**.
2. Copy the repo URL GitHub shows you, then:

```bash
cd swasthsetu-ai
git remote add origin https://github.com/YOUR_USERNAME/swasthsetu-ai.git
git branch -M main
git push -u origin main
```

## Then deploy

Once it's on GitHub, import it at [vercel.com/new](https://vercel.com/new) → **Deploy**. Ships in mock mode with zero env vars. Full steps in `docs/DEPLOYMENT.md`.

---

**Note:** `node_modules/`, `.next/`, and `.env.local` are gitignored (as they should be). Run `npm install` after cloning on a new machine.
