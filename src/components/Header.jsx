import logoLight from '../assets/nutriscan-logo.png';
import logoDark from '../assets/nutriscan-logo-dark.png';

export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="NutriScan home">
        <img className="brand-logo brand-logo-light" src={logoLight} alt="" aria-hidden="true" />
        <img className="brand-logo brand-logo-dark" src={logoDark} alt="" aria-hidden="true" />
      </a>
      <div className="topbar-actions">
        <button
          id="themeToggle"
          className="theme-toggle"
          type="button"
          aria-pressed={isDark}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          onClick={onToggleTheme}
        >
          <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
          <span id="themeToggleLabel">{isDark ? 'Light theme' : 'Dark theme'}</span>
        </button>
        <span className="top-pill"><i></i> Private, in-browser analysis</span>
      </div>
    </header>
  );
}
