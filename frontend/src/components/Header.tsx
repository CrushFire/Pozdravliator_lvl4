import '../styles/index.css';

export const Header = () => (
  <header className="header">
    <div className="header__top-bar"></div> {/* верхняя тень и потемнее */}

    <div className="header__main">
      <h1 className="header__title bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white">
        Поздравлятор
        <i className="bi bi-balloon-fill header__icon"></i>
      </h1>
    </div>

    <div className="header__bottom-bar"></div > {/* нижняя тень и потемнее */}
  </header>
);