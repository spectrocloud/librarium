import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

const baseTheme = {
  fonts: {
    mono: '"SF Mono", "Roboto Mono", Menlo, monospace',
  },
};

const lightTheme = {
  ...baseTheme,
  colors: {
    background: 'transparent',
    heading: '#000',
    text: '#666A80',
    preFormattedText: 'rgb(245, 247, 249)',
    link: '#206CD1',
  },
};

const darkTheme = {
  ...baseTheme,
  colors: {
    background: '#001933',
    heading: '#fff',
    text: '#fff',
    preFormattedText: '#000',
    link: '#1ED3C6',
  },
};

export function useThemeManager() {
  const [theme, updateTheme] = useState(
    (typeof window !== 'undefined' && window.localStorage.getItem('theme')) || 'light'
  );
  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, updateTheme };
}

export default function ThemeManager({ children }) {
  const { theme } = useThemeManager();
  const currentActiveTheme = theme === 'dark' ? darkTheme : lightTheme;
  return <ThemeProvider theme={currentActiveTheme}>{children}</ThemeProvider>;
}
