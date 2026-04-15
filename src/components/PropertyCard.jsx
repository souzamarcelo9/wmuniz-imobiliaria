import { motion } from 'framer-motion';
import { Maximize, Bed, Bath, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      {/* Imagem com Zoom no Hover */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700">
          {property.status == 'for_sale' ? 'Venda' : 'Locação'}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
          <span className="text-amber-600 font-bold text-lg">R$ {property.price.toLocaleString()}</span>
        </div>
        
        <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
          <MapPin size={14} /> {property.neighborhood}
        </p>

        {/* Info Grid */}
        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="flex flex-col items-center gap-1">
            <Maximize size={18} className="text-gray-400" />
            <span className="text-xs font-semibold">{property.area}m²</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-200 px-6">
            <Bed size={18} className="text-gray-400" />
            <span className="text-xs font-semibold">{property.rooms} Qts</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath size={18} className="text-gray-400" />
            <span className="text-xs font-semibold">{property.bathrooms} Ban</span>
          </div>
        </div>

        {/* <button className="w-full mt-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300">
          Ver Detalhes
        </button> */}

        <Link 
            to={`/imovel/${property.id}`} 
            className="w-full mt-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-center block"
          >
            Ver Detalhes
          </Link>
      </div>
    </motion.div>
  );
}