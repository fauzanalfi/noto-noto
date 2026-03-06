import { useState } from 'react';
import { DEFAULT_PARA_CATEGORIES } from '../utils';

const STEPS = [
  {
    icon: '◈',
    headline: 'Welcome to Noto!',
    body: 'Noto organises your notes using the PARA system — Projects, Areas, Resources, and Archive. Every idea has a home.',
    cta: 'Get Started →',
  },
  {
    icon: '📁',
    headline: 'Create your first notebook',
    body: 'Give it a name and choose a PARA category to keep everything organised from the start.',
    cta: 'Create Notebook →',
  },
  {
    icon: '⌘',
    headline: 'Pro tip: Quick Switcher',
    body: 'Press ⌘K (Ctrl+K on Windows) from anywhere to instantly jump to any note — no mouse needed.',
    cta: 'Done! Start writing',
  },
];

export default function Onboarding({ onComplete, onCreateNotebook }) {
  const [step, setStep] = useState(0);
  const [notebookName, setNotebookName] = useState('');
  const [category, setCategory] = useState('inbox');

  const handleNext = () => {
    if (step === 1) {
      // Create notebook if name provided
      if (notebookName.trim() && typeof onCreateNotebook === 'function') {
        onCreateNotebook(notebookName.trim(), category);
      }
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('noto-onboarded', 'true');
    if (typeof onComplete === 'function') onComplete();
  };

  const current = STEPS[step];

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-label="Welcome to Noto">
      <div className="onboarding-modal">
        <div className="onboarding-step">
          <div className="onboarding-icon" aria-hidden="true">
            {current.icon}
          </div>

          <h2 className="onboarding-headline">{current.headline}</h2>
          <p className="onboarding-body">{current.body}</p>

          {/* Step 2: notebook creation form */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input
                className="modal-input"
                placeholder="e.g. My Projects"
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                autoFocus
                aria-label="Notebook name"
              />
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  flexWrap: 'wrap',
                }}
                role="radiogroup"
                aria-label="PARA category"
              >
                {DEFAULT_PARA_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    role="radio"
                    aria-checked={category === cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${category === cat.id ? cat.color : 'var(--border-default)'}`,
                      background:
                        category === cat.id ? `${cat.color}22` : 'var(--bg-tertiary)',
                      color:
                        category === cat.id ? cat.color : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-xs)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step dots */}
          <div className="onboarding-dots" role="tablist" aria-label="Step progress">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`onboarding-dot${i === step ? ' active' : ''}`}
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1} of ${STEPS.length}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="onboarding-actions">
            <button className="onboarding-skip" onClick={handleComplete}>
              Skip tour
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ minWidth: 160 }}
            >
              {current.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
