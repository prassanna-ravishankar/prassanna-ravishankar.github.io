// Theme state lives on <html class="dark"> and in localStorage('theme'); the inline script in Layout.astro applies it before paint.
export const THEME_COLOR = { light: '#f5f6f3', dark: '#14161a' } as const;

export type Theme = keyof typeof THEME_COLOR;

export function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const theme: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
  return theme;
}
