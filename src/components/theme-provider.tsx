import { ScriptOnce } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  // oxlint-disable-next-line no-empty-function
  setTheme: () => {},
  theme: 'system',
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  const resolved =
    // oxlint-disable-next-line no-nested-ternary
    theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    // oxlint-disable-next-line react/set-state-in-effect
    setThemeState(stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme);
    setMounted(true);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    applyTheme(theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyTheme('system');
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next);
    setThemeState(next);
  };

  return (
    <ThemeProviderContext value={{ setTheme, theme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
