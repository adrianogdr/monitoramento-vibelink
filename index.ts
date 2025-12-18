import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import cors from '@fastify/cors'

// 1. Criar as instâncias
const prisma = new PrismaClient()
const server = fastify()

// 2. Configurar segurança (CORS)
// Isso permite que o seu site React acesse este servidor
server.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Adicionamos DELETE explicitamente aqui
})

// 3. Criar a Rota (O "Menu" do restaurante)
// Quando alguém acessar /maquinas, devolvemos os dados do banco
server.get('/maquinas', async () => {
  const lista = await prisma.maquina.findMany()
  return lista
})

// Rota para Ligar/Desligar uma máquina específica
server.post('/maquinas/:id/toggle', async (request, reply) => {
  // 1. Pega o ID que veio na URL (ex: /maquinas/1/toggle)
  const params = request.params as { id: string }
  const id = Number(params.id)

  // 2. Busca a máquina atual para saber se está ligada ou não
  const maquinaAtual = await prisma.maquina.findUnique({
    where: { id: id }
  })

  if (!maquinaAtual) {
    return reply.status(404).send({ error: "Máquina não encontrada" })
  }

  // 3. Inverte o status (Se true vira false, se false vira true)
  const maquinaAtualizada = await prisma.maquina.update({
    where: { id: id },
    data: { ligada: !maquinaAtual.ligada } // O símbolo "!" significa "o contrário de"
  })

  return maquinaAtualizada
})

// Rota para CRIAR uma nova máquina
server.post('/maquinas', async (request, reply) => {
  // 1. Recebe os dados que o Front-End mandou
  const dados = request.body as { nome: string; temperatura: number }
  
  // 2. Salva no Banco
  const novaMaquina = await prisma.maquina.create({
    data: {
      nome: dados.nome,
      temperatura: dados.temperatura,
      ligada: false // Toda máquina nova começa desligada por segurança
    }
  })

  // 3. Responde "Criado com sucesso" (Código 201)
  return reply.status(201).send(novaMaquina)
})

// Rota para DELETAR uma máquina
server.delete('/maquinas/:id', async (request, reply) => {
  const params = request.params as { id: string }
  const id = Number(params.id)

  // O comando do Prisma é direto: delete onde o ID for igual
  await prisma.maquina.delete({
    where: { id: id }
  })

  return reply.status(204).send() // 204 = "Sucesso, sem conteúdo para devolver"
})

// 4. Ligar o Servidor
// OUVINDO A PORTA
// Importante para o Render: host '0.0.0.0'
server.listen({ 
  host: '0.0.0.0', 
  port: process.env.PORT ? Number(process.env.PORT) : 3333 
}).then(() => {
  console.log('🔥 Servidor rodando...')
})