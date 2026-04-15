import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function LeadModal({ isOpen, onClose }) {
  const [step, setStep] = useState('form'); // form | loading | success
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    preferencia: 'Apartamento',
    mensagem: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('loading');

    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        origem: "Formulário Home - Não encontrou",
        status: "novo",
        createdAt: serverTimestamp()
      });
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('form'); // Reseta para a próxima abertura
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Erro ao enviar. Tente novamente ou nos chame no WhatsApp.");
      setStep('form');
    }
  };

  const formatWhatsApp = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, ''); // Remove tudo que não é número
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 3) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>

            <div className="p-8">
              {step === 'form' && (
                <>
                  <h2 className="text-2xl font-black italic mb-2">BUSCA EXCLUSIVA</h2>
                  <p className="text-gray-500 mb-6 text-sm">
                    Nossa equipe de curadoria fará uma busca personalizada fora do catálogo comum para você.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                      required
                      type="text" 
                      placeholder="Nome completo"
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-gray-900"
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        required
                        type="email" 
                        placeholder="Seu melhor e-mail"
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm text-gray-900"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      <input 
                        required
                        type="tel" 
                        placeholder="WhatsApp"
                        value={formData.whatsapp}
                        maxLength={15} // Limita para (11) 99999-9999
                        className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                        onChange={(e) => {
                          const formatted = formatWhatsApp(e.target.value);
                          setFormData({...formData, whatsapp: formatted});
                        }}
                      />
                    </div>
                    
                    <select 
                        className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm text-gray-900 appearance-none cursor-pointer"
                        onChange={(e) => setFormData({...formData, preferencia: e.target.value})}>
                        <option className="text-gray-900">Apartamento</option>
                        <option className="text-gray-900">Casa de Condomínio</option>
                        <option className="text-gray-900">Cobertura</option>
                        <option className="text-gray-900">Terreno</option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={18} />
                    </div>

                    <textarea 
                      placeholder="O que você busca? (Ex: Estácio, 3 quartos, 200m²...)"
                      rows="3"
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm resize-none text-gray-900"
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                    />

                    <button className="w-full bg-black text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
                      SOLICITAR CURADORIA <Send size={18} />
                    </button>
                  </form>
                </>
              )}

              {step === 'loading' && (
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-bold text-gray-600">Enviando solicitação...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold">Solicitação Recebida!</h3>
                  <p className="text-gray-500 text-sm mt-2">Um consultor especializado entrará em contato em breve.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}