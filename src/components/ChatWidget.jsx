import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Sou o assistente virtual da Walter Muniz Imobiliária! Como posso ajudar você hoje?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Novo estado para loading

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 1. Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true); // Mostra que o bot está "digitando"

    try {
      // 2. Chama a Cloud Function (substitua pela URL gerada no deploy)
      const functionUrl = "https://us-central1-realstate-walter.cloudfunctions.net/askPropertyAI"; // Sua URL do Firebase Functions
                           
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Falha na comunicação.');

      const data = await response.json();

      // 3. Adiciona a resposta real da OpenAI
      const botMsg = { 
        id: Date.now() + 1, 
        text: data.response, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Erro no Chatbot:", error);
      // Mensagem de erro amigável para o usuário
      const errorMsg = { 
        id: Date.now() + 1, 
        text: "Desculpe, tive um problema técnico. Você pode tentar novamente ou nos chamar no WhatsApp?", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false); // Esconde o loading
    }
  };

/* export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Sou o assistente virtual da Images Properties. Como posso ajudar você hoje?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulação de resposta (Aqui conectaremos com n8n ou OpenAI depois)
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: "Entendido! Estou processando sua dúvida sobre nossos imóveis...", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };
 */
  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* Botão Flutuante */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Janela de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header do Chat */}
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-xl">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Assistente IA</h4>
                  <p className="text-[10px] text-amber-200 uppercase tracking-widest font-bold">Online 24/7</p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-amber-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre bairros ou valores..." 
                className="flex-1 bg-gray-50 p-3 rounded-xl outline-none text-sm focus:ring-1 focus:ring-amber-500"
              />
              <button 
                onClick={handleSend}
                className="bg-primary text-white p-3 rounded-xl hover:bg-amber-600 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}