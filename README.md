# 🏭 Vibelink Monitor - Sistema de Gestão Industrial

Painel de controle Full Stack para monitoramento de máquinas industriais (temperatura, status de operação) em tempo real.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando a stack moderna cobrada pelo mercado:

- **Front-end:** React + Vite + TypeScript
- **Back-end:** Node.js + Fastify
- **Banco de Dados:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Linguagem:** TypeScript

## ⚙️ Funcionalidades

- ✅ **Listagem:** Visualização de todas as máquinas cadastradas.
- ✅ **Criação:** Formulário para adicionar novos equipamentos.
- ✅ **Atualização:** Botão interativo para Ligar/Desligar máquinas (muda status e cor).
- ✅ **Exclusão:** Remoção de máquinas do banco de dados.

## 📦 Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- Docker rodando (para o banco de dados)

### Passos

1. **Clone o repositório**
   \`\`\`bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   \`\`\`

2. **Instale as dependências**
   \`\`\`bash
   npm install
   cd web
   npm install
   cd ..
   \`\`\`

3. **Configure o Banco de Dados**
   \`\`\`bash
   # Suba o container do Docker
   docker compose up -d

   # Gere a estrutura do banco
   npx prisma migrate dev
   \`\`\`

4. **Rode a aplicação**
   
   Terminal 1 (Back-end):
   \`\`\`bash
   npx tsx index.ts
   \`\`\`

   Terminal 2 (Front-end):
   \`\`\`bash
   cd web
   npm run dev
   \`\`\`

---
Desenvolvido por **Adriano** como estudo de caso Full Stack.