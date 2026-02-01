import { Cliente } from '@/domain/entities/Cliente'

export const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'Cooperativa Alfa',
    cnpj: '12.345.678/0001-90',
    email: 'contato@cooperativaalfa.com.br',
    emails: 'contato@cooperativaalfa.com.br;financeiro@cooperativaalfa.com.br',
    telefone: '(11) 3456-7890',
  },
  {
    id: 2,
    nome: 'AgroFábrica Delta',
    cnpj: '23.456.789/0001-01',
    email: 'financeiro@agrodelta.com.br',
    emails: 'financeiro@agrodelta.com.br;cobranca@agrodelta.com.br',
    telefone: '(19) 9876-5432',
  },
  {
    id: 3,
    nome: 'Indústria Soja Brasil',
    cnpj: '34.567.890/0001-12',
    email: 'cobranca@sojabrasil.com.br',
    emails: 'cobranca@sojabrasil.com.br;adm@sojabrasil.com.br;financeiro@sojabrasil.com.br',
    telefone: '(44) 3344-5566',
  },
  {
    id: 4,
    nome: 'Fazenda Horizonte',
    cnpj: '45.678.901/0001-23',
    email: 'adm@fazendahorizonte.com.br',
    emails: 'adm@fazendahorizonte.com.br',
    telefone: '(16) 2233-4455',
  },
  {
    id: 5,
    nome: 'Nutrição Animal Sul',
    cnpj: '56.789.012/0001-34',
    email: 'contato@nutricaosul.com.br',
    emails: 'contato@nutricaosul.com.br;compras@nutricaosul.com.br',
    telefone: '(54) 3221-9988',
  },
]
