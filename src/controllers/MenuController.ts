import { menuPrincipalProps } from '../interfaces/interfaceMenu'

export const menuApp: menuPrincipalProps[] = [
  {
    id: self.crypto.randomUUID(),
    categoria: 'Home',
    telaItemCategoria: import('../views/Venda'),
    admin: false,
  },
  {
    id: self.crypto.randomUUID(),
    categoria: 'Administrar',
    admin: false,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: 'Formas de pagamentos',
        telaItem: import('../views/FormaPagamento'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Categorias',
        telaItem: import('../views/Categorias'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Fornecedores',
        telaItem: import('../views/Fornecedor'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Produtos',
        telaItem: import('../views/Produtos'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Estoque',
        telaItem: import('../views/Estoque'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Movimentação de caixa',
        telaItem: import('../views/Caixa/MovimentacaoManual'),
        admin: false,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Vendas fiado',
        telaItem: import('../views/Fiado'),
        admin: false,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    categoria: 'Relatórios',
    admin: true,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: 'Vendas',
        telaItem: import('../views/Relatorios/Vendas'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Caixa',
        telaItem: import('../views/Relatorios/Caixa'),
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: 'Estoque',
        telaItem: import('../views/Relatorios/Estoque'),
        admin: true,
      },
    ],
  },
]
