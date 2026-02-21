export default function LoginScreen({ onSignIn, error }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="sidebar-logo" style={{ width: 56, height: 56, fontSize: '1.5rem', marginBottom: '12px' }}>N</div>
        <h1 className="login-title">Noto.</h1>
        <p className="login-subtitle">Your Second Brain — organised with PARA.</p>

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

        <p className="login-hint">Notes are saved to your account and synced across devices.</p>
      </div>
    </div>
  );
}
