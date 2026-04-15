import { onRequest } from "firebase-functions/v2/https";
import { OpenAI } from "openai";

export const askPropertyAI = onRequest({ 
    cors: true, 
    secrets: ["GROQ_API_KEY"] 
  }, 
  async (req, res) => {
    // 1. Verificação básica de segurança
    if (req.method !== 'POST') {
      return res.status(405).send('Método não permitido');
    }

    const { message } = req.body;
    
    // Inicializa o cliente usando o Secret injetado no process.env
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY, 
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemPrompt = `
      Você é o corretor virtual de elite da Walter Muniz Imobiliária.
      Diretrizes de comportamento:
      1. Seja sofisticado, atencioso e use um tom de consultoria de luxo.
      2. Informações da Empresa: Estamos localizados no Rio de Janeiro. Nosso CRECI é 123.456-J.
      3. Especialidade: Focamos em apartamentos de alto padrão no Rio, Grande Rio e Região Oceânica.
      4. Objetivo: Sua missão é tirar dúvidas e, se o cliente demonstrar interesse real, peça educadamente o nome e telefone para que um consultor humano entre em contato.
      5. Não invente preços específicos se não tiver certeza, fale em "valores a partir de...".
    `;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.6,
      });

      // Retorna a resposta com status 200 explicitamente
      return res.status(200).json({ response: completion.choices[0].message.content });
      
    } catch (error) {
      console.error("Erro na integração com Groq:", error);
      // Evita que o chat do cliente trave
      return res.status(500).json({ error: "Desculpe, tive um problema ao processar sua resposta." });
    }
});