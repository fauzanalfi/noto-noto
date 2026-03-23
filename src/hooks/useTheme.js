import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'noto-theme';
const VALID_THEMES = ['dark', 'light', 'eyecare'];

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_THEMES.includes(saved)) return saved;
    } catch { /* ignore */ }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update meta theme-color for PWA
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const colors = { dark: '#0e0e10', light: '#f9fafb', eyecare: '#f4ecd8' };
      metaTheme.setAttribute('content', colors[theme] || '#0e0e10');
    }
  }, [theme]);

  const setTheme = useCallback((t) => {
    if (VALID_THEMES.includes(t)) setThemeState(t);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = VALID_THEMES.indexOf(prev);
      return VALID_THEMES[(idx + 1) % VALID_THEMES.length];
    });
  }, []);

  return {
    theme,
    setTheme,
    cycleTheme,
  };
}
