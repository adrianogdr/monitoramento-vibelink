import { useEffect, useState } from 'react'
import './App.css'

interface Maquina {
  id: number;
  nome: string;
  temperatura: number;
  ligada: boolean;
}

// Seu link da API na nuvem
const API_URL = "https://vibelink-api.onrender.com"

function App() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])

  // Estados do formulário
  const [nome, setNome] = useState('')
  const [temp, setTemp] = useState('')

  // NOVO: Estado para controlar o aviso de carregamento
  // Começa como true porque ao abrir o site ele já começa buscando
  const [carregando, setCarregando] = useState(true)

  // Função de buscar dados
  async function carregarMaquinas() {
    setCarregando(true) // Mostra o aviso
    try {
      const response = await fetch(`${API_URL}/maquinas`)
      const data = await response.json()
      setMaquinas(data)
    } catch (error) {
      console.error("Erro ao buscar:", error)
    } finally {
      setCarregando(false) // Esconde o aviso (dando certo ou errado)
    }
  }

  // Carrega ao iniciar
  useEffect(() => {
    carregarMaquinas()
  }, [])

  // Função Ligar/Desligar
  async function ligarDesligar(id: number) {
    await fetch(`${API_URL}/maquinas/${id}/toggle`, { method: 'POST' })
    carregarMaquinas()
  }

  // Função Deletar (MOVIDA PARA O LUGAR CERTO)
  async function deletarMaquina(id: number) {
    if (!confirm("Tem certeza que quer remover esta máquina?")) return

    await fetch(`${API_URL}/maquinas/${id}`, {
      method: 'DELETE'
    })

    carregarMaquinas()
  }

  // Função Criar Nova
  // Substitua a função criarMaquina por esta:
  async function criarMaquina(event: React.FormEvent) {
    event.preventDefault()
    if (!nome || !temp) return alert("Preencha todos os campos!")

    setCarregando(true)

    const response = await fetch(`${API_URL}/maquinas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        temperatura: parseFloat(temp)
      })
    })

    // NOVA LÓGICA: Se der erro (ex: limite atingido), avisa o usuário
    if (!response.ok) {
      const erro = await response.json()
      alert(erro.error || "Erro desconhecido") // Mostra a mensagem que veio do Back-End
      setCarregando(false)
      return
    }

    setNome('')
    setTemp('')
    carregarMaquinas()
  }

  return (
    <div className="container">
      <h1>Painel Vibelink 🎛️</h1>

      <form onSubmit={criarMaquina} className="form-maquina">
        <input
          placeholder="Nome da Máquina (ex: Forno 02)"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          placeholder="Temp. Atual"
          type="number"
          value={temp}
          onChange={e => setTemp(e.target.value)}
        />
        <button type="submit">➕ Adicionar</button>
      </form>

      {/* LÓGICA DO LOADING: Se estiver carregando, mostra texto. Se não, mostra as máquinas */}
      {carregando ? (
        <div className="loading-area">
          <p>🔄 <strong>Conectando ao servidor industrial...</strong></p>
          <p><small>(Como usamos servidor gratuito, isso pode levar até 1 minuto na primeira vez)</small></p>
        </div>
      ) : (
        <div className="card-grid">
          {maquinas.length === 0 && <p>Nenhuma máquina cadastrada.</p>}

          {maquinas.map(maquina => (
            <div key={maquina.id} className="card">
              <h3>{maquina.nome}</h3>

              <div className="status-row">
                <span className={`status-indicator ${maquina.ligada ? 'on' : 'off'}`}></span>
                <span>{maquina.ligada ? 'OPERANDO' : 'PARADA'}</span>
              </div>

              <p>Temp: <strong>{maquina.temperatura}°C</strong></p>

              <div className="actions">
                <button
                  onClick={() => ligarDesligar(maquina.id)}
                  className={maquina.ligada ? 'btn-stop' : 'btn-start'}
                >
                  {maquina.ligada ? '🛑' : '⚡'}
                </button>

                <button
                  onClick={() => deletarMaquina(maquina.id)}
                  className="btn-delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App