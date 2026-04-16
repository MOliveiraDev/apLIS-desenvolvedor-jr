import { useCallback, useState } from 'react'
import { ZodError } from 'zod'
import { createMedico, listMedicos } from '../api/medicos'
import { medicoInputSchema } from '../schemas/medico'

export function useMedicos() {
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listMedicos()
      setMedicos(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (rawPayload) => {
    try {
      setSubmitting(true)
      const payload = medicoInputSchema.parse(rawPayload)
      await createMedico(payload)
      await load()
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.issues[0]?.message || 'Dados inválidos para médico.')
      }

      throw error
    } finally {
      setSubmitting(false)
    }
  }, [load])

  return {
    medicos,
    loading,
    submitting,
    load,
    create,
  }
}
