import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Linkedin, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import LeadModal from '../modals/LeadModal'

export default function Footer() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-primary text-white pt-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Seção 1: CTA de Newsletter / Contato Rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-gray-800">
          <div>
            <h3 className="text-3xl font-black mb-4 italic text-amber-500">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-400 max-w-md">
              Nossa curadoria exclusiva tem acesso a imóveis "off-market" que não estão no site.
            </p>
          </div>
          <div className="flex items-center">
            {/* Botão que abre o modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center gap-3"
            >
              FALAR COM UM ESPECIALISTA <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Seção 2: Links e Infos do Corretor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Branding e CRECI */} 
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black tracking-tighter italic">
              <span className="text-amber-500">WMUNIZ-IMOBILIÁRIA</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Especialistas em curadoria imobiliária de alto padrão no Rio de Janeiro e região metropolitana.
            </p>
            <div className="text-xs font-bold text-amber-500/80 tracking-widest uppercase">
              CRECI: 123.456-J
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Navegação</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/imoveis" className="hover:text-amber-500 transition-colors">Todos os Imóveis</Link></li>
              <li><Link to="/imoveis?status=Venda" className="hover:text-amber-500 transition-colors">Comprar</Link></li>
              <li><Link to="/imoveis?status=Locação" className="hover:text-amber-500 transition-colors">Alugar</Link></li>
              <li><Link to="/area-cliente" className="hover:text-amber-500 transition-colors">Minha Conta</Link></li>
            </ul>
          </div>

          {/* Contato Oficial */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500" /> (11) 98765-4321
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500" /> contato@wmuniz.com.br
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-amber-500" /> Av. Faria Lima, 1500 - SP
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Seção 3: Copyright */}
        <div className="py-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2026 WMUNIZ Imobiliária. Todos os direitos reservados. Desenvolvido por JADS.
        </div>

      </div>
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}