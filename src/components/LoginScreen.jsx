import { BookOpen, Zap, Lock, RefreshCw, Tag, Layout } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'PARA Method',
    desc: 'Organise notes into Projects, Areas, Resources & Archive.',
  },
  {
    icon: Zap,
    title: 'Markdown Editor',
    desc: 'Full-featured editor with horizontal and vertical split preview.',
  },
  {
    icon: RefreshCw,
    title: 'Real-time Sync',
    desc: 'All notes synced across every device instantly.',
  },
  {
    icon: Tag,
    title: 'Tags & Notebooks',
    desc: 'Flexible tagging system for powerful organisation.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    desc: 'Your notes are private, tied to your Google account.',
  },
  {
    icon: Layout,
    title: 'Distraction-free',
    desc: 'Zen mode keeps you focused on what matters.',
  },
];

export default function LoginScreen({ onSignIn, error }) {
  return (
    <div className="login-screen">
      {/* Left — branding & features */}
      <div className="login-hero">
        <div className="login-hero-inner">
          <div className="login-hero-logo">
            <div className="sidebar-logo" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>N</div>
            <span className="login-hero-brand">noto</span>
          </div>

          <h2 className="login-hero-headline">
            Your Second Brain,<br />beautifully organised.
          </h2>
          <p className="login-hero-sub">
            A fast, Markdown-first note-taking app built around the PARA method — so every idea has a home.
          </p>

          <div className="login-features">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={feature.title} className="login-feature-item">
                <div className="login-feature-icon">
                    <FeatureIcon size={16} />
                </div>
                <div>
                    <div className="login-feature-title">{feature.title}</div>
                    <div className="login-feature-desc">{feature.desc}</div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* decorative blobs */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
      </div>

      {/* Right — auth card */}
      <div className="login-auth">
        <div className="login-card">
          <div className="login-card-logo">
            <div className="sidebar-logo" style={{ width: 52, height: 52, fontSize: '1.5rem' }}>N</div>
          </div>

          <h1 className="login-title">Welcome to Noto</h1>
          <p className="login-subtitle">Sign in to access your notes from anywhere.</p>

          <button className="login-google-btn" onClick={onSignIn}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.532 24.552c0-1.636-.147-3.2-.418-4.69H24.48v8.865h12.974c-.56 3.016-2.254 5.57-4.8 7.282v6.054h7.769c4.544-4.186 7.109-10.35 7.109-17.51z" fill="#4285F4"/>
              <path d="M24.48 48c6.508 0 11.964-2.156 15.953-5.837l-7.769-6.054c-2.156 1.444-4.913 2.296-8.184 2.296-6.294 0-11.628-4.25-13.53-9.963H2.924v6.25C6.896 42.641 15.112 48 24.48 48z" fill="#34A853"/>
              <path d="M10.95 28.442A14.4 14.4 0 0 1 10.2 24c0-1.542.264-3.039.75-4.442v-6.25H2.924A23.95 23.95 0 0 0 .48 24c0 3.867.927 7.527 2.444 10.692l8.026-6.25z" fill="#FBBC05"/>
              <path d="M24.48 9.596c3.546 0 6.726 1.22 9.232 3.612l6.922-6.922C36.435 2.39 30.98 0 24.48 0 15.112 0 6.896 5.36 2.924 13.308l8.026 6.25c1.902-5.713 7.236-9.962 13.53-9.962z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {error && <p className="login-error">{error}</p>}

          <p className="login-terms">
            By continuing, you agree that your notes are stored securely and privately in your account.
          </p>

          <div className="login-divider" />

          <div className="login-badges">
            <span className="login-badge">🔒 End-to-end private</span>
            <span className="login-badge">⚡ Instant sync</span>
            <span className="login-badge">📱 Mobile ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
