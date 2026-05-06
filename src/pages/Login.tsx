import { Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm mode="login" />;
};

export default Login;
