# Usa uma imagem leve do Node
FROM node:20-slim

# Cria o diretório do app
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Expõe a porta que o Cloud Run usa
EXPOSE 8080

# Comando para rodar o servidor
CMD ["node", "server.js"]
