export function Sidebar({ activeView, onChangeView }) {
  return (
    <aside className="sidebar">
      <p className="brand-kicker">apLIS</p>
      <h1 className="brand-title">Painel Clínico</h1>
      <p className="brand-description">Navegue entre os módulos para cadastrar e consultar dados.</p>

      <nav className="menu" aria-label="Menu principal">
        <button
          type="button"
          className={`menu-item ${activeView === 'medicos' ? 'active' : ''}`}
          onClick={() => onChangeView('medicos')}
        >
          Médicos
        </button>
        <button
          type="button"
          className={`menu-item ${activeView === 'pacientes' ? 'active' : ''}`}
          onClick={() => onChangeView('pacientes')}
        >
          Pacientes
        </button>
      </nav>
    </aside>
  )
}
