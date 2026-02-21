# Noto — Deployment Guide (Power Users)

This guide covers every deployment option for the Noto note-taking app, from local development to production hosting.

---

## Prerequisites

| Tool        | Version | Check            |
| ----------- | ------- | ---------------- |
| **Node.js** | ≥ 18.x  | `node --version` |
| **npm**     | ≥ 9.x   | `npm --version`  |
| **Git**     | any     | `git --version`  |

---

## 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> noto-noto
cd noto-noto

# Install dependencies
npm install
```

---

## 2. Local Development

```bash
npm run dev
```

- Opens at `http://localhost:5173/`
- Hot Module Replacement (HMR) enabled via Vite
- Changes auto-reload in the browser

---

## 3. Production Build

```bash
npm run build
```

This generates a static `dist/` folder with:

```
dist/
├── index.html          # Entry point
├── assets/
│   ├── index-XXXX.js   # Bundled JS (tree-shaken, minified)
│   └── index-XXXX.css  # Bundled CSS (minified)
└── manifest.json       # PWA manifest (if present)
```

### Preview the Build Locally

```bash
npm run preview
```

Opens at `http://localhost:4173/` — this is the production build served locally.

---

## 4. Deploy to Vercel (Recommended)

### Option A: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option B: GitHub Integration

1. Push your code to a **GitHub** repository
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

**Settings (auto-detected):**

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Custom Domain

```bash
vercel domains add yourdomain.com
```

Or configure in Vercel Dashboard → Project Settings → Domains.

---

## 5. Deploy to Netlify

### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build first
npm run build

# Deploy draft (preview)
netlify deploy --dir=dist

# Deploy to production
netlify deploy --prod --dir=dist
```

### Option B: Git Integration

1. Push to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Select your repo
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

### `netlify.toml` (Optional — add to project root)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> The redirect rule ensures client-side routing works for Single Page Apps.

---

## 6. Deploy to GitHub Pages

### Step 1: Configure `vite.config.js`

Add a `base` path matching your GitHub repo name:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/noto-noto/", // Replace with your repo name
});
```

### Step 2: Build

```bash
npm run build
```

### Step 3: Deploy with `gh-pages`

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Or add this to `package.json` scripts:

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / `root`
4. Your app will be at: `https://<username>.github.io/noto-noto/`

---

## 7. Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name=noto
```

Or use the Cloudflare Dashboard:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create
2. Connect your Git repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output:** `dist`
4. Click **Deploy**

---

## 8. Deploy with Docker

### `Dockerfile`

Create this in your project root:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing support
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build & Run

```bash
# Build the Docker image
docker build -t noto .

# Run on port 8080
docker run -d -p 8080:80 --name noto noto
```

Access at `http://localhost:8080/`

### Docker Compose (optional)

```yaml
# docker-compose.yml
services:
  noto:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

## 9. Deploy to a VPS (DigitalOcean, Linode, AWS EC2)

### Step 1: Build Locally

```bash
npm run build
```

### Step 2: Transfer Files

```bash
# Using rsync
rsync -avz dist/ user@your-server:/var/www/noto/

# Or using scp
scp -r dist/* user@your-server:/var/www/noto/
```

### Step 3: Nginx Configuration

```nginx
# /etc/nginx/sites-available/noto
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/noto;
    index index.html;

    # SPA routing — redirect all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/noto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: SSL with Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 10. Environment Variables

Noto currently uses **no environment variables**. All data is stored in the browser's `localStorage`. No backend, no API keys, no database.

If you add API integrations later, use Vite's env system:

```bash
# .env.local (never commit this)
VITE_API_URL=https://api.example.com
```

Access in code as `import.meta.env.VITE_API_URL`.

---

## 11. PWA Installation

Noto is PWA-ready. After deploying with HTTPS:

1. Visit your deployed URL in Chrome/Edge/Safari
2. Click the **Install** icon in the address bar (or "Add to Home Screen" on mobile)
3. The app installs as a standalone app with its own icon

> **Note:** PWA installation requires HTTPS. Local dev (`localhost`) works without HTTPS.

---

## 12. Troubleshooting

| Issue                   | Solution                                                  |
| ----------------------- | --------------------------------------------------------- |
| Blank page after deploy | Check `base` in `vite.config.js` matches your deploy path |
| 404 on page refresh     | Add SPA redirect rules (see Netlify/Nginx configs above)  |
| Build fails             | Run `npm ci` to clean-install dependencies                |
| Old cache shown         | Hard refresh with `Ctrl+Shift+R` or clear service worker  |
| PWA not installing      | Ensure HTTPS is enabled on your domain                    |
