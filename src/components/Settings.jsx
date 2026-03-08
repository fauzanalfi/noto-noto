import { createElement, useState } from 'react';
import { X, User, Palette, Type, Info } from 'lucide-react';

const THEME_OPTIONS = [
  { id: 'dark',     icon: '🌙', label: 'Dark' },
  { id: 'light',    icon: '☀️', label: 'Light' },
  { id: 'eyecare',  icon: '👓', label: 'Eye Care' },
];

const NAV_ITEMS = [
  { id: 'account',    icon: User,    label: 'Account' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'editor',     icon: Type,    label: 'Editor' },
  { id: 'about',      icon: Info,    label: 'About' },
];

export default function Settings({
  onClose,
  theme,
  onThemeChange,
  neumorphismEnabled,
  onNeumorphismChange,
  user,
  onSignOut,
}) {
  const [activeSection, setActiveSection] = useState('appearance');

  const handleSignOut = () => {
    onClose();
    onSignOut?.();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <h2>Settings</h2>
          <button
            className="toolbar-btn"
            onClick={onClose}
            aria-label="Close settings"
            style={{ marginRight: '-4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="settings-body">
          {/* Left nav */}
          <nav className="settings-sidebar" aria-label="Settings sections">
            {NAV_ITEMS.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`settings-nav-item ${activeSection === id ? 'active' : ''}`}
                onClick={() => setActiveSection(id)}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                {createElement(icon, { size: 15, 'aria-hidden': 'true' })}
                {label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-content" role="region" aria-label={`${activeSection} settings`}>
            {activeSection === 'account' && (
              <div>
                <p className="settings-section-title">Account</p>
                {user && (
                  <div className="settings-account">
                    <div className="settings-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User avatar'} />
                      ) : (
                        <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="settings-user-name">
                        {user.displayName || 'User'}
                      </div>
                      <div className="settings-user-email">{user.email}</div>
                    </div>
                  </div>
                )}
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Sign out</div>
                    <div className="settings-hint">You'll need to sign in again to access your notes.</div>
                  </div>
                  <button className="btn btn-danger" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div>
                <p className="settings-section-title">Appearance</p>
                <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                  <div className="settings-label">Theme</div>
                  <div className="theme-options" role="radiogroup" aria-label="Color theme">
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        role="radio"
                        aria-checked={theme === opt.id}
                        className={`theme-option ${theme === opt.id ? 'selected' : ''}`}
                        onClick={() => onThemeChange(opt.id)}
                      >
                        <span className="theme-option-icon" aria-hidden="true">{opt.icon}</span>
                        <span className="theme-option-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <div>
                    <div className="settings-label">
                      Neumorphism <span className="settings-beta-pill">Beta</span>
                    </div>
                    <div className="settings-hint">Enable depth-heavy shadows and inset surfaces.</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={neumorphismEnabled}
                    aria-label="Toggle Neumorphism style"
                    className={`settings-switch ${neumorphismEnabled ? 'on' : ''}`}
                    onClick={() => onNeumorphismChange(!neumorphismEnabled)}
                  >
                    <span className="settings-switch-thumb" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'editor' && (
              <div>
                <p className="settings-section-title">Editor</p>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Spell check</div>
                    <div className="settings-hint">Enable browser spell checking in the editor.</div>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-tertiary)',
                      padding: '2px 8px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Browser default
                  </span>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Auto-save</div>
                    <div className="settings-hint">Notes save automatically as you type.</div>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-success)',
                      padding: '2px 8px',
                      background: 'var(--color-success-subtle)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Always on
                  </span>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Font family</div>
                    <div className="settings-hint">Editor monospace font for Markdown source.</div>
                  </div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    JetBrains Mono
                  </span>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div>
                <p className="settings-section-title">About</p>
                <div className="settings-row">
                  <div className="settings-label">Version</div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    2.0.0
                  </span>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Noto Design System</div>
                    <div className="settings-hint">Noto 2.0 — March 2026</div>
                  </div>
                </div>
                <div className="settings-row">
                  <div className="settings-label">Keyboard shortcuts</div>
                  <div />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                  {[
                    ['⌘K / Ctrl+K', 'Quick Switcher'],
                    ['⌘N / Ctrl+N', 'New note'],
                    ['⌘S / Ctrl+S', 'Force save'],
                    ['⌘1', 'Edit mode'],
                    ['⌘2', 'Preview mode'],
                    ['⌘3', 'Split mode'],
                    ['⌘4', 'Zen mode'],
                    ['⌘F / Ctrl+F', 'Focus search'],
                    ['Esc', 'Close modal / Quit zen'],
                  ].map(([key, action]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-tertiary)',
                        padding: '3px 0',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '1px 6px', borderRadius: 'var(--radius-sm)' }}>
                        {key}
                      </span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
