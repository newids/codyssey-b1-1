const THEME_STORAGE_KEY = 'portfolio-theme';
const DARK = 'dark';
const LIGHT = 'light';

const rootElement = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = (theme) => {
  rootElement.setAttribute('data-theme', theme);
  themeToggleBtn.setAttribute('aria-pressed', String(theme === DARK));
  themeToggleBtn.setAttribute('aria-label', theme === DARK ? '라이트 모드로 전환' : '다크 모드로 전환');
};

const readInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === DARK || savedTheme === LIGHT) return savedTheme;
  return systemDarkQuery.matches ? DARK : LIGHT;
};

applyTheme(readInitialTheme());

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = rootElement.getAttribute('data-theme');
  const nextTheme = currentTheme === DARK ? LIGHT : DARK;

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

systemDarkQuery.addEventListener('change', ({ matches }) => {
  const hasSavedPreference = localStorage.getItem(THEME_STORAGE_KEY) !== null;
  if (hasSavedPreference) return;
  applyTheme(matches ? DARK : LIGHT);
});
