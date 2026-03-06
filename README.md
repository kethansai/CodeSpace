# codespace

**Learn. Code. Crack Interviews.**

codespace is an educational platform for developers — master programming concepts, DSA with animated visualizations, solve coding problems with a built-in compiler, and prepare for tech interviews at top companies.

Built with **Vue 3 + TypeScript + Vite**, **Tailwind CSS v4**, **Monaco Editor**, **GSAP + D3.js**, and deployed on **Cloudflare Pages**.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (for Cloudflare deployments)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/codespace-dev/codespace.git
cd codespace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

This runs type-checking (`vue-tsc`) and builds the app into the `dist/` folder.

### 5. Preview the production build locally

```bash
npm run preview
```

---

## Deploying to Cloudflare Pages

### Install Wrangler (if not already installed)

```bash
npm install -g wrangler
```

### Authenticate with Cloudflare

```bash
wrangler login
```

This opens a browser window to log in to your Cloudflare account.

### Deploy

```bash
npm run build
wrangler pages deploy dist --project-name codespace --branch main
```

On the first run, Wrangler will create the project automatically and deploy. Subsequent runs will publish a new deployment.

### Deploy to a preview branch

```bash
wrangler pages deploy dist --project-name codespace --branch feature-xyz
```

Preview deployments get a unique URL like `https://<hash>.codespace-xxx.pages.dev`.

---

## Cloudflare Pages Management Commands

### List all deployments

```bash
wrangler pages deployment list --project-name codespace
```

### Delete a specific deployment

```bash
wrangler pages deployment delete --project-name codespace <deployment-id>
```

### Tail production logs

```bash
wrangler pages deployment tail --project-name codespace
```

### Delete the entire project

> **Warning:** This is irreversible and removes all deployments and custom domains.

```bash
wrangler pages project delete codespace
```

### Set a custom domain

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **codespace**
2. Click **Custom domains** → **Set up a custom domain**
3. Enter your domain and follow the DNS setup steps

---

## Environment Variables

| Variable              | Description                            | Default                                  |
| --------------------- | -------------------------------------- | ---------------------------------------- |
| `VITE_APP_URL`        | Public URL of the app                  | `https://codespace.dev`                  |
| `VITE_PISTON_API_URL` | Piston API endpoint for code execution | `https://emkc.org/api/v2/piston/execute` |

Create a `.env` file in the project root to override defaults:

```env
VITE_APP_URL=https://your-domain.com
VITE_PISTON_API_URL=https://emkc.org/api/v2/piston/execute
```

---

## Project Structure

```
src/
├── assets/css/       # Tailwind CSS design tokens
├── components/       # Vue components (ui, editor, visualizer, layout)
├── composables/      # Vue composables (code execution, search, themes)
├── config/           # App configuration
├── data/             # Static data (DSA topics, problems, languages, paths)
├── layouts/          # Page layouts
├── lib/              # Utility functions
├── pages/            # Route pages
├── router/           # Vue Router config
├── stores/           # Pinia stores (preferences, progress)
└── utils/            # Algorithm utilities (sorting, advanced)
```

---

## Tech Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + shadcn-vue (Radix Vue)
- **Code Editor:** Monaco Editor
- **Animations:** GSAP + D3.js
- **State Management:** Pinia (with persisted state)
- **Markdown:** marked + Shiki (syntax highlighting)
- **Diagrams:** Mermaid
- **Hosting:** Cloudflare Pages

---

## License

This project is private.
