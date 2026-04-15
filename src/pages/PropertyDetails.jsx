import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import { MapPin, Maximize, Bed, Bath, Calendar, MessageCircle } from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery';
import PropertyMap from '../components/PropertyMap';
import { createLead } from '../services/leadService';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  date: ''
});
const [sending, setSending] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSending(true);

  const result = await createLead({
    ...formData,
    propertyId: id,
    propertyTitle: property.title
  });

  if (result.success) {
    alert("Agendamento solicitado com sucesso! Entraremos em contato.");
    setFormData({ name: '', email: '', phone: '', date: '' }); // Limpa o form
  } else {
    alert("Erro ao enviar. Tente novamente via WhatsApp.");
  }
  setSending(false);
};

const handleWhatsApp = () => {
  const message = encodeURIComponent(
    `Olá! Gostaria de mais informações sobre o imóvel: ${property.title}. Link: ${window.location.href}`
  );
  window.open(`https://wa.me/55SEUNUMERO?text=${message}`, '_blank');
};

  useEffect(() => {
    const fetchProperty = async () => {
      const docRef = doc(db, "properties", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProperty({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Carregando detalhes...</div>;
  if (!property) return <div className="h-screen flex items-center justify-center">Imóvel não encontrado.</div>;

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-24 pb-20 px-4 max-w-7xl mx-auto"
    >
      {/* Título e Preço */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">{property.title}</h1>
          <p className="flex items-center gap-2 text-gray-500">
            <MapPin size={20} className="text-accent" /> {property.neighborhood}, {property.city || 'São Paulo'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-400 uppercase font-bold">Valor do Investimento</p>
          <p className="text-3xl font-black text-amber-600">R$ {property.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Galeria de Fotos */}
      <section className="mb-12">
        <PropertyGallery images={property.images || [property.image]} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Descrição e Infos */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-3 gap-4 border-y py-8 border-gray-100">
            <div className="flex flex-col items-center">
              <Maximize size={24} className="text-gray-400 mb-1" />
              <span className="font-bold text-lg">{property.area}m²</span>
              <span className="text-xs text-gray-400 uppercase">Área Total</span>
            </div>
            <div className="flex flex-col items-center border-x border-gray-100">
              <Bed size={24} className="text-gray-400 mb-1" />
              <span className="font-bold text-lg">{property.rooms}</span>
              <span className="text-xs text-gray-400 uppercase">Dormitórios</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath size={24} className="text-gray-400 mb-1" />
              <span className="font-bold text-lg">{property.bathrooms}</span>
              <span className="text-xs text-gray-400 uppercase">Banheiros</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Sobre este imóvel</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {property.description || "Este imóvel de luxo oferece o equilíbrio perfeito entre conforto e sofisticação. Localizado em uma das áreas mais valorizadas, conta com acabamentos premium e infraestrutura completa."}
            </p>
          </div>

          {/* Mapa Interativo (O que você pediu: Proximidade e POIs) */}
          <div>
            <h3 className="text-2xl font-bold mb-6 italic">Localização e Arredores</h3>
            <PropertyMap 
              coords={property.coordinates || { lat: -23.5505, lng: -46.6333 }} 
              address={property.neighborhood} 
            />
          </div>
        </div>

        {/* Barra Lateral: Agendamento e Lead (Mini-CRM) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-2xl border border-gray-50">
            <h4 className="text-xl font-bold mb-6">Agendar Visita</h4>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                type="text" 
                placeholder="Seu nome" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent" 
            />

            <input 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent"
            />

            <input 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                type="tel" 
                placeholder="Seu WhatsApp" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent"
            />
                                          
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Data Sugerida</label>
                <input 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    type="date" 
                    placeholder="Data sugerida" 
                    className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent"
                />                
              </div>

              <button disabled={sending}
                  type="submit"                  
                  className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg disabled:opacity-50">
                  {sending ? (
                    'Enviando...' 
                  ) : (
                    <>
                      <Calendar size={20} className="text-amber-500" /> {/* Ícone em âmbar dá um toque premium */}
                      Solicitar Agendamento
                    </>
                  )}
              </button>

                <button 
                    onClick={handleWhatsApp}
                    type="button"
                    className="w-full bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
                    >
                    <MessageCircle size={20} /> Conversar agora
                </button>
              
            </form>
            <p className="text-[10px] text-gray-400 mt-4 text-center">
              Ao enviar, você concorda com nossos termos de uso e política de privacidade.
            </p>
          </div>
        </aside>
      </div>
    </motion.main>
  );
}