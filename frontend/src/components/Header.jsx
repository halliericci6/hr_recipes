import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__icon" aria-hidden="true">🥐</span>
          <div>
            <h1 className="header__title">HR Recipes</h1>
            <p className="header__subtitle">Baking inventory from my cookbook collection</p>
          </div>
        </div>
      </div>
    </header>
  );
}
