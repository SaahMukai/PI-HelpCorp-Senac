import { beforeEach, describe, expect, it } from 'vitest'
import { mockTicketsApi } from './ticketsApi'

describe('mockTicketsApi', () => {
  beforeEach(() => localStorage.clear())

  it('persiste um chamado criado e o encontra pelo id', async () => {
    const created = await mockTicketsApi.create({
      title: 'Acesso ao sistema de campanhas',
      description: 'Não consigo acessar o sistema de campanhas desde hoje pela manhã.',
      categoryId: 'ti-software',
      priority: 'high',
      attachments: [],
    })

    expect(created.protocol).toMatch(/^#\d+$/)
    expect(created.status).toBe('new')
    const found = await mockTicketsApi.get(created.id)
    expect(found.title).toBe('Acesso ao sistema de campanhas')
    expect(JSON.parse(localStorage.getItem('helpcorp:tickets:v1') ?? '[]')).toHaveLength(5)
  })

  it('atualiza status e adiciona comentário ao histórico', async () => {
    const ticket = await mockTicketsApi.get('tkt-4821')
    const updated = await mockTicketsApi.update(ticket.id, { status: 'resolved' })
    const commented = await mockTicketsApi.addComment(updated.id, { message: 'Problema resolvido.', author: updated.assignee! })

    expect(commented.status).toBe('resolved')
    expect(commented.timeline.some((item) => item.message === 'Problema resolvido.')).toBe(true)
    expect(commented.timeline.some((item) => item.message.includes('Resolvido'))).toBe(true)
  })

  it('filtra chamados por prioridade e busca', async () => {
    const result = await mockTicketsApi.list({ priority: 'critical', search: 'internet' })
    expect(result).toHaveLength(1)
    expect(result[0].protocol).toBe('#4802')
  })
})
