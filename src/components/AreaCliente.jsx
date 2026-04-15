import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, LogOut, Home, User } from 'lucide-react';

export default function AreaCliente() {
  const [user, setUser] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        fetchFavoritos(userAuth.uid);
      } else {
        navigate('/auth'); // Se não estiver logado, volta para o login
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchFavoritos = async (uid) => {
    try {
      // Aqui assume-se que tem uma coleção 'favoritos' onde guarda {userId, imóvelData}
      const q = query(collection(db, "favoritos"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavoritos(favs);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col">
        <h1 className="text-xl font-black italic text-amber-500 mb-12">WMUNIZ IMOBILIÁRIA </h1>
        
        <nav className="space-y-6 flex-1">
          <button className="flex items-center gap-3 text-amber-500 font-bold">
            <User size={20} /> Meu Perfil
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-gray-400 hover:text-white transition-all">
            <Home size={20} /> Voltar ao Site
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 transition-all pt-6 border-t border-gray-800"
        >
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black">Olá, {user?.displayName || 'Cliente'}</h2>
            <p className="text-gray-500">Bem-vindo à sua curadoria imobiliária exclusiva.</p>
          </div>
          <a 
            href="https://wa.me/55XXXXXXXXXXX" 
            target="_blank" 
            className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-200"
          >
            <MessageCircle size={20} /> Falar com Especialista
          </a>
        </header>

        {/* Grid de Favoritos */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="text-red-500 fill-red-500" size={24} />
            <h3 className="text-xl font-bold">Imóveis Favoritos</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-3xl" />)}
            </div>
          ) : favoritos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritos.map((fav) => (
                <div key={fav.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <img src={fav.imagem} alt={fav.titulo} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-lg">{fav.titulo}</h4>
                    <p className="text-amber-600 font-black">{fav.preco}</p>
                    <button 
                       onClick={() => navigate(`/imovel/${fav.imovelId}`)}
                       className="mt-4 w-full py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <Home className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">Ainda não favoritou nenhum imóvel.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 text-amber-600 font-bold underline"
              >
                Explorar catálogo
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}