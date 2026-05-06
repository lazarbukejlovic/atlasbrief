import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="glass-card rounded-[1.75rem] p-6 text-sm text-navy-muted">
        Loading account state...
      </section>
    );
  }

  if (!isAuthenticated) {
    const redirectTarget = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect=${redirectTarget}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
