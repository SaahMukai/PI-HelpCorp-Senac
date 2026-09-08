import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'ti-hardware',
    sector: 'Tecnologia da Informação',
    name: 'Hardware',
    path: 'TI > Hardware',
    description: 'Computadores, notebooks, periféricos e equipamentos.',
  },
  {
    id: 'ti-software',
    sector: 'Tecnologia da Informação',
    name: 'Software e acessos',
    path: 'TI > Software e acessos',
    description: 'Sistemas corporativos, senhas, licenças e permissões.',
  },
  {
    id: 'ti-infra',
    sector: 'Tecnologia da Informação',
    name: 'Infraestrutura',
    path: 'TI > Infraestrutura',
    description: 'Rede, internet, telefonia e indisponibilidade de serviços.',
  },
  {
    id: 'rh-documentos',
    sector: 'Recursos Humanos',
    name: 'Documentos e benefícios',
    path: 'RH > Documentos e benefícios',
    description: 'Declarações, folha, férias e benefícios corporativos.',
  },
  {
    id: 'financeiro-reembolso',
    sector: 'Financeiro',
    name: 'Reembolsos',
    path: 'Financeiro > Reembolsos',
    description: 'Dúvidas e solicitações relacionadas a reembolsos.',
  },
  {
    id: 'facilities',
    sector: 'Facilities',
    name: 'Estrutura e manutenção',
    path: 'Facilities > Estrutura e manutenção',
    description: 'Manutenção predial, salas e ocorrências no escritório.',
  },
]

export const getCategoryById = (id: string) => categories.find((category) => category.id === id)
