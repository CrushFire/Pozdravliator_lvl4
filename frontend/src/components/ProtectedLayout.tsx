import { Navigate, Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navigation />
      <main className="layout__main">
          <Outlet />
      </main>
    </>
  );
};