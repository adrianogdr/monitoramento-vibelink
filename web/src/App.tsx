import { useEffect, useState } from 'react'
import './App.css'

interface Maquina {
  id: number;
  nome: string;
  temperatura: number;
  ligada: boolean;
}

function App() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])

  // NOVOS ESTADOS: Para guardar o que está sendo digitado
  const [nome, setNome] = useState('')
  const [temp, setTemp] = useState('')

  async function carregarMaquinas() {
    const response = await fetch('http://localhost:3333/maquinas')
    const data = await response.json()
    setMaquinas(data)
  }

  useEffect(() => { carregarMaquinas() }, [])

  async function ligarDesligar(id: number) {
    await fetch(`http://localhost:3333/maquinas/${id}/toggle`, { method: 'POST' })
    carregarMaquinas()
  }

  // NOVA FUNÇÃO: Envia a nova máquina para o servidor
  async function criarMaquina(event: React.FormEvent) {
    event.preventDefault() // Impede a página de recarregar sozinha

    if (!nome || !temp) return alert("Preencha todos os campos!")

    await fetch('http://localhost:3333/maquinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Avisa que estamos mandando JSON
      body: JSON.stringify({
        nome: nome,
        temperatura: parseFloat(temp) // Converte texto "50" para número 50
      })
    })

    // Limpa os campos e recarrega a lista
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

      <div className="card-grid">
        {maquinas.map(maquina => (
          <div key={maquina.id} className="card">
            <h3>{maquina.nome}</h3>

            <div className="status-row">
              <span className={`status-indicator ${maquina.ligada ? 'on' : 'off'}`}></span>
              <span>{maquina.ligada ? 'OPERANDO' : 'PARADA'}</span>
            </div>

            <p>Temp: <strong>{maquina.temperatura}°C</strong></p>

            {/* AQUI ESTÃO OS DOIS BOTÕES JUNTOS */}
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
    </div>
  )

  // Função para deletar
  async function deletarMaquina(id: number) {
    // Pergunta de segurança (ninguém quer deletar sem querer)
    if (!confirm("Tem certeza que quer remover esta máquina?")) return

    await fetch(`http://localhost:3333/maquinas/${id}`, {
      method: 'DELETE'
    })

    // Atualiza a tela
    carregarMaquinas()
  }
}

export default App