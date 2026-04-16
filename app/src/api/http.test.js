import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestJson } from './http'

describe('requestJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve retornar json quando resposta for ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    )

    const data = await requestJson('http://fake-url', undefined, 'falha')
    expect(data).toEqual({ ok: true })
  })

  it('deve lançar mensagem da api quando resposta for erro', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Erro customizado' }), { status: 422 })
    )

    await expect(requestJson('http://fake-url', undefined, 'falha')).rejects.toThrow(
      'Erro customizado'
    )
  })

  it('deve usar fallback quando resposta de erro nao tiver json valido', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('sem json', { status: 500 })
    )

    await expect(requestJson('http://fake-url', undefined, 'Falha fallback')).rejects.toThrow(
      'Falha fallback'
    )
  })
})
