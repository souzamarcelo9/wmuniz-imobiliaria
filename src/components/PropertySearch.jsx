import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, BedDouble } from 'lucide-react';

export default function PropertySearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: '',
    type: 'Todos',
    rooms: '0'
  });

  const handleSearch = () => {
  const queryParams = new URLSearchParams();
  
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.type !== 'Todos') queryParams.append('type', filters.type);
  if (filters.rooms !== '0') queryParams.append('rooms', filters.rooms);

  const queryString = queryParams.toString();
  navigate(`/imoveis${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end border border-gray-100">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <MapPin size={16} className="text-amber-600" /> Localização
          </label>
          <input 
            type="text" 
            placeholder="Rua ou bairro..." 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Home size={16} className="text-amber-600" /> Tipo
          </label>
          <select 
            value={filters.type} 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"            
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="Todos">Todos</option>
            <option value="Apartment">Apartamento</option>
            <option value="house">Casa</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <BedDouble size={16} className="text-amber-600" /> Quartos
          </label>
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
            onChange={(e) => setFilters({...filters, rooms: e.target.value})}
          >
            <option value="0">Qualquer</option>
            <option value="1">1+ Quarto</option>
            <option value="2">2+ Quartos</option>
            <option value="3">3+ Quartos</option>
          </select>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-200"
        >
          <Search size={20} /> Buscar
        </button>
      </div>
    </div>
  );
}