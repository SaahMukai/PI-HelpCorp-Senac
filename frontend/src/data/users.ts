import type { User } from '../types'

export const requesterUser: User = {
  id: 'usr-camila',
  name: 'Camila Rodrigues',
  initials: 'CR',
  role: 'requester',
  department: 'Marketing',
  email: 'camila.rodrigues@helpcorp.com.br',
}

export const attendantUser: User = {
  id: 'usr-ricardo',
  name: 'Ricardo Mendes',
  initials: 'RM',
  role: 'attendant',
  department: 'Infraestrutura e Suporte de TI',
  email: 'ricardo.mendes@helpcorp.com.br',
}

export const supportUsers: User[] = [
  attendantUser,
  {
    id: 'usr-juliana',
    name: 'Juliana Alves',
    initials: 'JA',
    role: 'attendant',
    department: 'Suporte de TI',
    email: 'juliana.alves@helpcorp.com.br',
  },
  {
    id: 'usr-bruno',
    name: 'Bruno Santos',
    initials: 'BS',
    role: 'attendant',
    department: 'Suporte de TI',
    email: 'bruno.santos@helpcorp.com.br',
  },
]
