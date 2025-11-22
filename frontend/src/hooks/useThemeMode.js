import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, THEME_MODES } from '@config/constants';
import { prefersDarkMode } from '@utils/helpers';

/**
 * Custom hook for managing theme mode (light/dark)
 */
export const useThemeMode = () => {
  // Get initial theme mode from localStorage or system preference
  const getInitialMode = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (stored) {
      return stored;
    }
    return prefersDarkMode() ? THEME_MODES.DARK : THEME_MODES.LIGHT;
  };

  const [mode, setMode] = useLocalStorage(STORAGE_KEYS.THEME_MODE, getInitialMode());

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) =>
      prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    );
  };

  // Set specific theme mode
  const setThemeMode = (newMode) => {
    if (newMode === THEME_MODES.LIGHT || newMode === THEME_MODES.DARK) {
      setMode(newMode);
    }
  };

  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only auto-update if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (!hasManualPreference) {
        setMode(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [setMode]);

  return {
    mode,
    toggleTheme,
    setThemeMode,
    isDark: mode === THEME_MODES.DARK,
    isLight: mode === THEME_MODES.LIGHT,
  };
};

export default useThemeMode;
