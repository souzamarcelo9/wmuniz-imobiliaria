import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'framer-motion';

export default function ListPage() {
  const { properties, loading } = useProperties();
  const [searchParams] = useSearchParams();

  // Lógica de Filtro em tempo real
 const filteredProperties = properties.filter(p => {
  const loc = searchParams.get('location')?.toLowerCase().trim() || '';
  const typeParam = searchParams.get('type')?.toLowerCase().trim() || 'todos';
  const roomsParam = parseInt(searchParams.get('rooms')) || 0;

  const propertyType = p.type?.toLowerCase().trim() || '';
  
  // AJUSTE AQUI: O campo no seu banco está escrito "roomts"
  const propertyRooms = p.roomts || 0; 

  const matchesLocation = p.neighborhood.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc);
  const matchesType = typeParam === 'todos' || propertyType === typeParam;
  
  // Agora a comparação será feita com o campo correto
  const matchesRooms = propertyRooms >= roomsParam;

  return matchesLocation && matchesType && matchesRooms;
});

  if (loading) return <div className="pt-40 text-center font-bold">Carregando catálogo...</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-black text-gray-900">Explore Nossos Imóveis</h1>
        <p className="text-gray-500 mt-2">{filteredProperties.length} imóveis encontrados para você.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Nenhum imóvel encontrado com esses critérios.</p>
        </div>
      )}
    </div>
  );
}