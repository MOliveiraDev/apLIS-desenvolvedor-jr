import { API } from './config'
import { requestJson } from './http'
import { medicosListSchema } from '../schemas/medico'

export async function listMedicos() {
  const payload = await requestJson(API.medicos, undefined, 'Falha ao buscar médicos.')

  const parsed = medicosListSchema.safeParse(payload)
  if (!parsed.success) {
    throw new Error('Resposta inválida da API de médicos.')
  }

  return parsed.data
}

export async function createMedico(medicoPayload) {
  await requestJson(
    API.medicos,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicoPayload),
    },
    'Falha ao cadastrar médico.'
  )
}
