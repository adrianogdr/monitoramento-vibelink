import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import cors from '@fastify/cors'

const prisma = new PrismaClient()
const server = fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// === SISTEMA DE SEGURANÇA ANTISPAM ===
// Variável para guardar quando foi a última ação feita no servidor
let ultimaAcao = 0 
const INTERVALO_MINIMO = 3000 // 3 segundos (em milissegundos)

// Função para verificar se está "spamando"
function verificarSpam() {
  const agora = Date.now()
  if (agora - ultimaAcao < INTERVALO_MINIMO) {
    throw new Error("⏳ Calma lá! Espere 3 segundos entre as ações.")
  }
  ultimaAcao = agora
}

// 1. Rota de Leitura (Sempre liberada)
server.get('/maquinas', async () => {
  const lista = await prisma.maquina.findMany({
    orderBy: { id: 'asc' } // Ordena para não ficar mudando de posição
  })
  return lista
})

// 2. Criar Máquina (Com limite de 6)
server.post('/maquinas', async (request, reply) => {
  try {
    verificarSpam() // 1ª Proteção: Velocidade

    // 2ª Proteção: Quantidade Máxima
    const totalMaquinas = await prisma.maquina.count()
    if (totalMaquinas >= 6) {
      return reply.status(403).send({ 
        error: "🚫 Limite de demonstração atingido! Máximo de 6 máquinas permitidas neste portfólio." 
      })
    }

    const dados = request.body as { nome: string; temperatura: number }
    
    const novaMaquina = await prisma.maquina.create({
      data: {
        nome: dados.nome, // Aqui você poderia limitar o tamanho do texto também (ex: .substring(0, 20))
        temperatura: dados.temperatura,
        ligada: false
      }
    })
    return reply.status(201).send(novaMaquina)

  } catch (erro: any) {
    return reply.status(429).send({ error: erro.message })
  }
})

// 3. Ligar/Desligar (Com proteção de velocidade)
server.post('/maquinas/:id/toggle', async (request, reply) => {
  try {
    verificarSpam() // Proteção de velocidade

    const params = request.params as { id: string }
    const id = Number(params.id)

    const maquinaAtual = await prisma.maquina.findUnique({ where: { id } })
    if (!maquinaAtual) return reply.status(404).send({ error: "Máquina não encontrada" })

    const atualizada = await prisma.maquina.update({
      where: { id },
      data: { ligada: !maquinaAtual.ligada }
    })
    return atualizada

  } catch (erro: any) {
    return reply.status(429).send({ error: erro.message })
  }
})

// 4. Deletar (Com proteção de velocidade)
server.delete('/maquinas/:id', async (request, reply) => {
  try {
    verificarSpam() // Proteção de velocidade

    const params = request.params as { id: string }
    const id = Number(params.id)

    await prisma.maquina.delete({ where: { id } })
    return reply.status(204).send()

  } catch (erro: any) {
    return reply.status(429).send({ error: erro.message })
  }
})

server.listen({ 
  host: '0.0.0.0', 
  port: process.env.PORT ? Number(process.env.PORT) : 3333 
}).then(() => {
  console.log('🔥 Servidor Anti-Spam rodando...')
})