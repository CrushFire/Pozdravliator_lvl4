import '../styles/index.css';

export const Footer = () => (
  <footer className="footer">
    <div className="footer__top-bar"></div>

    <div className="footer__main">
      <p className="footer__text">
        &copy; {new Date().getFullYear()} Все права защищены
      </p>
    </div>

    <div className="footer__bottom-bar"></div>
  </footer>
);