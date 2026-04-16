import { useState } from 'react'

const initialPacienteForm = {
  nome: '',
  dataNascimento: '',
  carteirinha: '',
  cpf: '',
}

export function PacientesView({ pacientes, loading, submitting, onSubmit }) {
  const [form, setForm] = useState(initialPacienteForm)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const saved = await onSubmit(form)

    if (saved) {
      setForm(initialPacienteForm)
    }
  }

  return (
    <>
      <section className="panel reveal">
        <form className="form" onSubmit={handleSubmit}>
          <h3>Novo paciente</h3>
          <div className="grid two">
            <label>
              Nome
              <input
                required
                value={form.nome}
                onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
                placeholder="Ex.: Maria Souza"
              />
            </label>
            <label>
              Data de nascimento
              <input
                required
                type="date"
                value={form.dataNascimento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dataNascimento: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="grid two">
            <label>
              Carteirinha
              <input
                required
                value={form.carteirinha}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, carteirinha: event.target.value }))
                }
                placeholder="Ex.: 998877"
              />
            </label>
            <label>
              CPF
              <input
                required
                value={form.cpf}
                onChange={(event) => setForm((prev) => ({ ...prev, cpf: event.target.value }))}
                placeholder="Somente números"
              />
            </label>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Cadastrar paciente'}
          </button>
        </form>
      </section>

      <section className="panel reveal delay-1">
        <div className="list-head">
          <h3>Registros</h3>
          <span>{pacientes.length} itens</span>
        </div>

        {loading ? (
          <p className="muted">Carregando dados...</p>
        ) : (
          <ul className="list">
            {pacientes.length === 0 && <li className="empty">Nenhum paciente cadastrado.</li>}
            {pacientes.map((paciente) => (
              <li key={`${paciente.id}-${paciente.cpf}`}>
                <strong>{paciente.nome}</strong>
                <small>
                  {formatDate(paciente.dataNascimento)} • CPF {paciente.cpf}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function formatDate(value) {
  if (!value) {
    return 'Data não informada'
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('pt-BR')
}
