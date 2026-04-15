import express from 'express';
import { OpenAI } from 'openai'; // Continuamos usando a lib da OpenAI!
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
// Configuramos para apontar para o Groq
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Use sua chave do Groq aqui
  baseURL: "https://api.groq.com/openai/v1", 
});

app.post('/ask', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await client.chat.completions.create({
      // Llama3-8b é gratuito e voa de rápido!
      model: "llama3-8b-8192", 
      messages: [
        { 
          role: "system", 
          content: "Você é o assistente virtual da Images Properties. Seja cordial e focado em imóveis de luxo." 
        },
        { role: "user", content: message }
      ],
      temperature: 0.5,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Erro no Groq:", error);
    res.status(500).json({ error: "Falha ao processar resposta." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor Groq rodando na porta ${PORT}`));