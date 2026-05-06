import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { destinations } from './data/destinations';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import DestinationDetail from './pages/DestinationDetail';
import Destinations from './pages/Destinations';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Saved from './pages/Saved';

const App = () => {
  return (
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
