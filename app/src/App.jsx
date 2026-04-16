import { useEffect, useMemo, useState } from 'react'
import { FeedbackAlert } from './components/FeedbackAlert'
import { MedicosView } from './components/MedicosView'
import { PacientesView } from './components/PacientesView'
import { Sidebar } from './components/Sidebar'
import { useMedicos } from './hooks/useMedicos'
import { usePacientes } from './hooks/usePacientes'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('medicos')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const {
    medicos,
    loading: loadingMedicos,
    submitting: submittingMedicos,
    load: loadMedicos,
    create: createMedico,
  } = useMedicos()
  const {
    pacientes,
    loading: loadingPacientes,
    submitting: submittingPacientes,
    load: loadPacientes,
    create: createPaciente,
  } = usePacientes()

  const viewMeta = useMemo(
    () => ({
      medicos: {
        title: 'Médicos',
        subtitle: 'Cadastre profissionais e visualize a equipe médica em tempo real.',
      },
      pacientes: {
        title: 'Pacientes',
        subtitle: 'Gerencie a carteira de pacientes com cadastro rápido e organizado.',
      },
    }),
    []
  )

  useEffect(() => {
    const load = async () => {
      setFeedback({ type: '', message: '' })

      try {
        if (activeView === 'medicos') {
          await loadMedicos()
        } else {
          await loadPacientes()
        }
      } catch (error) {
        setFeedback({
          type: 'error',
          message: error.message || 'Não foi possível carregar os dados.',
        })
      }
    }

    load()
  }, [activeView, loadMedicos, loadPacientes])

  const handleMedicoSubmit = async (payload) => {
    setFeedback({ type: '', message: '' })

    try {
      await createMedico(payload)
      setFeedback({ type: 'success', message: 'Médico cadastrado com sucesso.' })
      return true
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao cadastrar médico.' })
      return false
    }
  }

  const handlePacienteSubmit = async (payload) => {
    setFeedback({ type: '', message: '' })

    try {
      await createPaciente(payload)
      setFeedback({ type: 'success', message: 'Paciente cadastrado com sucesso.' })
      return true
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao cadastrar paciente.' })
      return false
    }
  }

  return (
    <div className="layout">
      <Sidebar activeView={activeView} onChangeView={setActiveView} />

      <main className="content">
        <header className="content-header">
          <p className="section-kicker">Gestão de cadastro</p>
          <h2>{viewMeta[activeView].title}</h2>
          <p>{viewMeta[activeView].subtitle}</p>
        </header>

        <FeedbackAlert feedback={feedback} />

        {activeView === 'medicos' ? (
          <MedicosView
            medicos={medicos}
            loading={loadingMedicos}
            submitting={submittingMedicos}
            onSubmit={handleMedicoSubmit}
          />
        ) : (
          <PacientesView
            pacientes={pacientes}
            loading={loadingPacientes}
            submitting={submittingPacientes}
            onSubmit={handlePacienteSubmit}
          />
        )}
      </main>
    </div>
  )
}

export default App
