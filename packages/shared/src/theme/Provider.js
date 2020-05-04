import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme, darkTheme } from './index';

export function useThemeManager() {
  const [theme, updateTheme] = useState(window.localStorage.getItem('theme') || "light");
  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme])

  return {theme, updateTheme}
}

export default function ThemeManager({children}) {
  const {theme} = useThemeManager();
  const currentActiveTheme = theme === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={currentActiveTheme}>{children}</ThemeProvider>
  )
};
