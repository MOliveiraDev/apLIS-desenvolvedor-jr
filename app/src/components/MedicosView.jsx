import { useState } from 'react'

const initialMedicoForm = {
  nome: '',
  CRM: '',
  UFCRM: '',
}

export function MedicosView({ medicos, loading, submitting, onSubmit }) {
  const [form, setForm] = useState(initialMedicoForm)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const saved = await onSubmit(form)

    if (saved) {
      setForm(initialMedicoForm)
    }
  }

  return (
    <>
      <section className="panel reveal">
        <form className="form" onSubmit={handleSubmit}>
          <h3>Novo médico</h3>
          <div className="grid two">
            <label>
              Nome
              <input
                required
                value={form.nome}
                onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
                placeholder="Ex.: João da Silva"
              />
            </label>
            <label>
              CRM
              <input
                required
                value={form.CRM}
                onChange={(event) => setForm((prev) => ({ ...prev, CRM: event.target.value }))}
                placeholder="Ex.: 123456"
              />
            </label>
          </div>
          <label>
            UF CRM
            <input
              required
              maxLength={2}
              value={form.UFCRM}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, UFCRM: event.target.value.toUpperCase() }))
              }
              placeholder="Ex.: CE"
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Cadastrar médico'}
          </button>
        </form>
      </section>

      <section className="panel reveal delay-1">
        <div className="list-head">
          <h3>Registros</h3>
          <span>{medicos.length} itens</span>
        </div>

        {loading ? (
          <p className="muted">Carregando dados...</p>
        ) : (
          <ul className="list">
            {medicos.length === 0 && <li className="empty">Nenhum médico cadastrado.</li>}
            {medicos.map((medico) => (
              <li key={`${medico.id}-${medico.CRM}`}>
                <strong>{medico.nome}</strong>
                <small>
                  CRM {medico.CRM} • {medico.UFCRM}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
