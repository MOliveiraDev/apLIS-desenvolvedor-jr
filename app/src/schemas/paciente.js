import { z } from 'zod'

export const pacienteInputSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  dataNascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato YYYY-MM-DD.'),
  carteirinha: z.string().trim().min(1, 'Carteirinha é obrigatória.'),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos.'),
})

export const pacienteResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  dataNascimento: z.string(),
  carteirinha: z.string(),
  cpf: z.string(),
})

export const pacientesListSchema = z.array(pacienteResponseSchema)
