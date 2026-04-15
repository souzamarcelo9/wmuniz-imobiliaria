import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ListPage from './pages/ListPage';
import Navbar from './components/layout/Navbar';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/Admin/AddProperty';
import Login from './pages/Admin/Login';
import LeadsPanel from './pages/Admin/LeadsPanel';
import AuthClient from './pages/Client/AuthClient';
import AreaCliente from './components/AreaCliente';
import Footer from './components/layout/Footer';
import ChatWidget from './components/ChatWidget';

function AppContent() {
  const location = useLocation();
  
  // Agora sim, o useLocation() vai disparar uma atualização toda vez que a rota mudar
  const isDashboard = location.pathname.startsWith('/area-cliente');
  const isAdmin = location.pathname.startsWith('/admin'); // Opcional: remover footer do admin também

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* O Navbar, Footer e Chat só aparecem se NÃO for dashboard e NÃO for admin */}
      {(!isDashboard && !isAdmin) && <Navbar />}

      <div className="flex-grow">
        <Routes>          
          <Route path="/" element={<Home />} />
          <Route path="/imoveis" element={<ListPage />} />
          <Route path="/imovel/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/novo" element={<AddProperty />} />
          <Route path="/auth" element={<AuthClient />} />
          <Route path="/area-cliente" element={<AreaCliente />} />
          <Route path="/admin/leads" element={<LeadsPanel />} />
        </Routes>
      </div>

      {(!isDashboard && !isAdmin) && <Footer />}
      {(!isDashboard && !isAdmin) && <ChatWidget />}        
    </div>
  );
}

// O App principal apenas inicia o Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;