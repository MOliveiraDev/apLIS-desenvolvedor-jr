import { useCallback, useState } from 'react'
import { ZodError } from 'zod'
import { createPaciente, listPacientes } from '../api/pacientes'
import { pacienteInputSchema } from '../schemas/paciente'

export function usePacientes() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listPacientes()
      setPacientes(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (rawPayload) => {
    try {
      setSubmitting(true)
      const payload = pacienteInputSchema.parse(rawPayload)
      await createPaciente(payload)
      await load()
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.issues[0]?.message || 'Dados inválidos para paciente.')
      }

      throw error
    } finally {
      setSubmitting(false)
    }
  }, [load])

  return {
    pacientes,
    loading,
    submitting,
    load,
    create,
  }
}
