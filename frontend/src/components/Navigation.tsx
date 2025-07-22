import { NavLink } from 'react-router-dom';
import navImage from '../assets/nav.png'; // путь к твоей картинке

export const Navigation = () => {
    const logout = () => {
    localStorage.removeItem('token');
  };
  return (
    <nav className="navigation">
      <NavLink to="/main" className="nav-item" end>
        <i className="bi bi-list-check"></i>
        <span>Все дни рождения</span>
      </NavLink>

      <NavLink to="/search" className="nav-item">
        <i className="bi bi-card-list"></i>
        <span>Поиск</span>
      </NavLink>

      <NavLink to="/calendar/:month" className="nav-item">
        <i className="bi bi-calendar3"></i>
        <span>Календарь</span>
      </NavLink>

      <NavLink to="/create" className="nav-item">
        <i className="bi bi-plus-circle"></i>
        <span>Добавить</span>
      </NavLink>

        <div className="nav-image-wrapper mt-6">
        <img src={navImage} alt="Навигация нижняя" className="nav-image" />
      </div>

            <NavLink to="/login" className="logout" onClick={logout}>
        <i className="bi bi-box-arrow-right"></i>
        Выйти
        </NavLink>
    </nav>
  );
};
