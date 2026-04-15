import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { auth } from '../../config/firebase';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Inscreve-se para ouvir mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Limpa a inscrição ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary">
          WMUNIZ<span className="text-amber-600">-IMOBILIÁRIA</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex space-x-8 font-medium text-sm uppercase tracking-widest">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <Link to="/imoveis" className="hover:text-amber-600 transition-colors">Imóveis</Link>
          </div>
          
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold uppercase"
          >
            <User size={18} /> Admin
          </Link>
          
         {/* Troca dinâmica de botões */}
        {user ? (
          <Link 
            to="/area-cliente" 
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full hover:bg-amber-600 transition-all"
          >
            <User size={16} /> MINHA ÁREA
          </Link>
        ) : (
          <Link 
            to="/auth" 
            className="bg-amber-500 text-white px-8 py-2.5 rounded-full hover:bg-black transition-all"
          >
            ENTRAR
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
}