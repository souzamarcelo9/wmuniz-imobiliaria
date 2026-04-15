import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

export default function AuthClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState(''); // Novo estado para capturar o nome no cadastro
  const navigate = useNavigate();

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

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/area-cliente'); // Direciona para o Dashboard do cliente
      } else {
        // CADASTRO (Criação de conta + Registro de Lead)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Salva os dados do novo usuário no Firestore como um Lead/Perfil
        await setDoc(doc(db, "users", user.uid), {
          nome: nome,
          email: email,
          uid: user.uid,
          role: "cliente",
          createdAt: serverTimestamp(),
          origem: "Cadastro Direto"
        });

        // Também podemos duplicar para a coleção de leads para facilitar a gestão comercial
        await setDoc(doc(db, "leads", user.uid), {
          nome: nome,
          email: email,
          status: "novo",
          tipo: "Cadastro de Conta",
          createdAt: serverTimestamp()
        });

        await updateProfile(user, { displayName: nome });

        navigate('/area-cliente');
      }
    } catch (err) {
      alert(`Erro na autenticação: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/30 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-2">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm italic">Sua jornada imobiliária premium começa aqui.</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Campo Nome só aparece no Cadastro */}
          {!isLogin && (
            <input 
              required
              type="text" placeholder="Nome Completo" 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
              onChange={(e) => setNome(e.target.value)}
            />
          )}
          
          <input 
            required
            type="email" placeholder="E-mail" 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          
          <input 
            required
            type="password" placeholder="Senha" 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-center mt-1">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-blue-600 hover:text-amber-600 font-medium transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <button className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all">
            {isLogin ? 'Entrar' : 'Cadastrar e Acessar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
          {isLogin ? 'Não tem conta?' : 'Já possui conta?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-amber-600 font-bold underline"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
        
      </div>      
    </div>
  );
}