export default function Navbar({ onRegisterClick }) {
  return (
    <header className="nav">
      <div className="nav__brand">
      <div className="nav__badge">
  <img src="/MI_LOGO.png" alt="Mood Indigo Logo" />
</div>
        <div>
          <div className="nav__title">MOOD INDIGO 2026</div>
        </div>
      </div>
      <nav className="nav__links">  
        <a href="#hero">About</a>
        <a href="#departments">Departments</a>
      </nav>
      <button className="button button--ghost nav__register-button" type="button" onClick={onRegisterClick} aria-label="Register">
        <img src="/REGISTER.png" alt="Register" className="nav__register-image" />
      </button>
    </header>
  );
}
