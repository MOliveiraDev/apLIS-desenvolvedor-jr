import { describe, expect, it } from 'vitest'
import { medicoInputSchema } from './medico'

describe('medicoInputSchema', () => {
  it('deve validar e normalizar UFCRM para maiusculo', () => {
    const parsed = medicoInputSchema.parse({
      nome: 'Joao da Silva',
      CRM: '123456',
      UFCRM: 'ce',
    })

    expect(parsed).toEqual({
      nome: 'Joao da Silva',
      CRM: '123456',
      UFCRM: 'CE',
    })
  })

  it('deve rejeitar UFCRM fora do tamanho esperado', () => {
    expect(() =>
      medicoInputSchema.parse({
        nome: 'Joao da Silva',
        CRM: '123456',
        UFCRM: 'C',
      })
    ).toThrow('UF CRM deve ter 2 caracteres.')
  })
})
