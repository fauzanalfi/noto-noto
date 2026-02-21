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
      const colors = { dark: '#1a1b2e', light: '#f5f5f7', eyecare: '#f5f0e8' };
      metaTheme.setAttribute('content', colors[theme] || '#1a1b2e');
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

  return { theme, setTheme, cycleTheme };
}
