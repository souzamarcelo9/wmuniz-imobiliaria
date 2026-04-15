import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { resetPassword } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/novo'); // Redireciona para o cadastro após logar
    } catch (err) {
      setError(`E-mail ou senha inválidos : ${err}` );
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    alert("Por favor, digite seu e-mail primeiro no campo acima.");
    return;
  }
  
   const confirm = window.confirm(`Enviar e-mail de redefinição para ${email}?`);
  if (confirm) {
    const result = await resetPassword(email);
    if (result.success) {
      alert("E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.");
    } else {
      alert("Erro ao enviar: " + result.error);
    }
  }
 };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-100 p-4 rounded-full mb-4">
            <Lock className="text-amber-600" size={30} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Acesso Restrito</h1>
          <p className="text-gray-400 text-sm">Entre com suas credenciais de Admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}    

           <div className="flex justify-center mt-1">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-blue-600 hover:text-amber-600 font-medium transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-black transition-all">
            Entrar no Painel
          </button>
        </form>
      </motion.div>
    </div>
  );
}