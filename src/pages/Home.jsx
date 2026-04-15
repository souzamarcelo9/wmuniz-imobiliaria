import { motion } from 'framer-motion';
import PropertySearch from '../components/PropertySearch';
import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties'; // Importando o hook
import { auth } from '../config/firebase'; // ajuste o caminho conforme seu projeto
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
// Dados fictícios para teste (depois virão do Firebase)

const featuredProperties = [
  { id: 1, title: "Luxury Villa", price: 2500000, neighborhood: "Itaim Bibi", area: 250, rooms: 4, bathrooms: 5, status: "Venda", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800" },
  { id: 2, title: "Modern Loft", price: 8500, neighborhood: "Vila Madalena", area: 85, rooms: 1, bathrooms: 1, status: "Locação", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800" },
];

export default function Home() {

  const { properties, loading } = useProperties();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleFavoritar = (imovel) => {
  if (!user) {
    // Se não estiver logado, redireciona para o login
    navigate('/auth');
    return;
  }
  // Se estiver logado, dispara a função de salvar no Firestore
  saveToFavorites(imovel);
};

useEffect(() => {
    // Inscreve-se para ouvir mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Limpa a inscrição ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <main>
      {/* Seção Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Banner Principal"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Encontre o seu lugar <br /> no mundo.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl opacity-90"
          >
            Curadoria exclusiva de imóveis de alto padrão.
          </motion.p>
        </div>
      </section>

      {/* Barra de Busca */}
      <PropertySearch />

      {/* Imóveis em Destaque */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Imóveis em Destaque</h2>
          {loading && <div className="animate-pulse text-gray-400">Carregando imóveis...</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 3).map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}