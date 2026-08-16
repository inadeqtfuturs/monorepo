type Theme = 'light' | 'dark';

declare global {
  interface Window {
    __theme: Theme;
    __onThemeChange: (theme: Theme) => void;
    __setPreferredTheme: (theme: Theme) => void;
  }
}

function code() {
  window.__onThemeChange = () => {};

  function setTheme(newTheme: Theme) {
    window.__theme = newTheme;
    preferredTheme = newTheme;
    document.documentElement.dataset.theme = newTheme;
    window.__onThemeChange(newTheme);
  }

  let preferredTheme: Theme | undefined;

  try {
    preferredTheme = localStorage.getItem('theme') as Theme;
  } catch (_err) {}

  window.__setPreferredTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (_err) {}
  };

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  darkQuery.addEventListener('change', (e) => {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light');
  });

  setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
}

export default function ThemeScript() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: needed
  return <script dangerouslySetInnerHTML={{ __html: `(${code})();` }} />;
}
