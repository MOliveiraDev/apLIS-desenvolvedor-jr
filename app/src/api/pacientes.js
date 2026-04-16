import { API } from './config'
import { requestJson } from './http'
import { pacientesListSchema } from '../schemas/paciente'

export async function listPacientes() {
  const payload = await requestJson(API.pacientes, undefined, 'Falha ao buscar pacientes.')

  const parsed = pacientesListSchema.safeParse(payload)
  if (!parsed.success) {
    throw new Error('Resposta inválida da API de pacientes.')
  }

  return parsed.data
}

export async function createPaciente(pacientePayload) {
  await requestJson(
    API.pacientes,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pacientePayload),
    },
    'Falha ao cadastrar paciente.'
  )
}
