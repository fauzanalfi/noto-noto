<div align="center">

  <img src="public/favicon.svg" alt="Noto Logo" width="72" />

  <h1>Noto</h1>
  <p><strong>A fast, Markdown-first note-taking app built around the PARA method.</strong></p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://noto-noto.vercel.app)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
  [![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- **PARA Method + Inbox** — Organise notes into Inbox (holding area), Projects, Areas, Resources & Archive
- **Markdown Editor** — Full toolbar with Bold, Italic, Headings, Lists, Code, Links, and more
- **Live Split Preview** — Side-by-side editing and rendered preview
- **Notebooks & Tags** — Flexible hierarchy with coloured notebooks and free-form tagging
- **Pin & Trash** — Star important notes; soft-delete with full restore support
- **Quick Switcher** — `Ctrl/Cmd+K` to jump to any note instantly
- **Zen Mode** — Distraction-free full-screen writing
- **Real-time Sync** — Powered by Firebase Firestore; all devices stay in sync
- **Three Themes** — Dark, Light, and Eye Care (warm sepia)
- **PWA Ready** — Installable on desktop and mobile, works offline-aware
- **Export** — Export individual notes as `.md` or back up everything as JSON
- **Google Auth** — Secure sign-in; notes are private to each account

## 🖼️ Screenshots

> _Add screenshots here once deployed._

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Plain CSS (custom design system) |
| Icons | Lucide React |
| Auth | Firebase Authentication (Google) |
| Database | Firebase Firestore |
| Markdown | `marked` + `DOMPurify` |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Firebase](https://console.firebase.google.com) project with **Authentication** (Google provider) and **Firestore** enabled

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/noto-noto.git
cd noto-noto

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Firebase credentials in .env

# 4. Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

For GitHub Pages demo deployment, follow the GitHub Actions steps in [DEPLOYMENT.md](DEPLOYMENT.md#6-deploy-to-github-pages).

## 🔒 Firestore Security Rules

Ensure notes are private per user. Apply these rules in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📁 Project Structure

```
noto-noto/
├── public/             # Static assets, favicon, PWA manifest
├── src/
│   ├── components/     # UI components (Editor, Sidebar, NotesList, …)
│   ├── hooks/          # Custom React hooks (useNotes, useAuth, …)
│   ├── assets/         # Images and SVGs
│   ├── test/           # Test setup files
│   ├── App.jsx         # Root layout and state
│   ├── firebase.js     # Firebase initialisation
│   ├── index.css       # Global design system & styles
│   └── utils.js        # Helper functions
├── .env                # Local environment variables (gitignored)
├── vite.config.js
└── vercel.json
```

## 📚 Documentation

- [App Documentation](docs/APP_DOCUMENTATION.md) — architecture, data model, hooks, and operational notes
- [Deployment Guide](DEPLOYMENT.md) — hosting and deployment options
- [Changelog](CHANGELOG.md) — recent project updates

## 🧪 Testing

Tests are written with Vitest and React Testing Library.

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Open Vitest UI
npm run test:ui
```

Coverage includes utility functions (`utils.js`) and custom hooks (`useDebounce`, `useNoteActions`).

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

## 📄 License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ☕ by <a href="https://github.com/fauzanalfi">Fauzan</a>
</div>