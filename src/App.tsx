import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { destinations } from './data/destinations';
import About from './pages/About';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import DestinationDetail from './pages/DestinationDetail';
import Destinations from './pages/Destinations';
import Home from './pages/Home';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Saved from './pages/Saved';
import Signup from './pages/Signup';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout destinations={destinations} />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:id" element={<DestinationDetail />} />
            <Route path="saved" element={<Saved />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
