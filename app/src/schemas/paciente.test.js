import { describe, expect, it } from 'vitest'
import { pacienteInputSchema } from './paciente'

describe('pacienteInputSchema', () => {
  it('deve validar payload completo', () => {
    const parsed = pacienteInputSchema.parse({
      nome: 'Maria Souza',
      dataNascimento: '1998-05-10',
      carteirinha: '998877',
      cpf: '12345678909',
    })

    expect(parsed.nome).toBe('Maria Souza')
    expect(parsed.cpf).toBe('12345678909')
  })

  it('deve rejeitar cpf invalido', () => {
    expect(() =>
      pacienteInputSchema.parse({
        nome: 'Maria Souza',
        dataNascimento: '1998-05-10',
        carteirinha: '998877',
        cpf: '123',
      })
    ).toThrow('CPF deve conter 11 dígitos numéricos.')
  })
})
