import { z } from 'zod'

export const medicoInputSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  CRM: z.string().trim().min(1, 'CRM é obrigatório.'),
  UFCRM: z
    .string()
    .trim()
    .length(2, 'UF CRM deve ter 2 caracteres.')
    .transform((value) => value.toUpperCase()),
})

export const medicoResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  CRM: z.string(),
  UFCRM: z.string(),
})

export const medicosListSchema = z.array(medicoResponseSchema)
