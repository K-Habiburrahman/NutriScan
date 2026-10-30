import { useCallback, useLayoutEffect, useState } from 'react';

const STORAGE_KEY = 'nutrilens-theme';

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.warn('Could not read the saved theme preference.', error);
    return 'light';
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(readSavedTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.warn('Could not save the theme preference.', error);
    }
  }, [theme]);

  return [theme, toggleTheme];
}
