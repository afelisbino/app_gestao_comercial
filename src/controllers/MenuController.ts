import { lazy } from "react";
import { menuPrincipalProps } from "../interfaces/interfaceMenu";

export const menuApp: menuPrincipalProps[] = [
  {
    id: self.crypto.randomUUID(),
    categoria: "Home",
    telaItemCategoria: "Venda/index.tsx",
    admin: false,
  },
  {
    id: self.crypto.randomUUID(),
    categoria: "Administrar",
    admin: false,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: "Categorias",
        telaItem: "Categorias/index.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Fornecedores",
        telaItem: "Fornecedor/index.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Produtos",
        telaItem: "Produtos/index.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Estoque",
        telaItem: "Estoque/index.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Movimentação de caixa",
        telaItem: "Caixa/MovimentacaoManual.tsx",
        admin: false,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Vendas fiado",
        telaItem: "Fiado/index.tsx",
        admin: false,
      },
      // {
      //   nome: "Usuários",
      //   telaItem: "Usuario",
      // },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    categoria: "Relatórios",
    admin: true,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: "Vendas",
        telaItem: "Relatorios/Vendas.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Caixa",
        telaItem: "Relatorios/Caixa.tsx",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Estoque",
        telaItem: "Relatorios/Estoque.tsx",
        admin: true,
      },
    ],
  },
];
