export interface estoqueMinProps {
  pro_token: string;
  pro_nome: string;
  est_atual: number | string;
  est_min: number | string;
}

export interface estoqueProps {
  pro_id: string;
  pro_nome: string;
  pro_qtd_atual: number;
  pro_qtd_minimo: number;
  pro_disponivel: boolean;
  pro_codigos: string[];
}

export interface produtoMaisVendidoProps {
  nome_produto: string;
  quantidade_vendido: number;
}

export interface quantidadeMovimentacoesEstoqueProps {
  tipo_movimentacao: string;
  total_movimentacoes: number;
}

export interface informacaoEstoqueProps {
  quantidade_estoque: number;
  quantidade_estoque_zerado: number;
  quantidade_estoque_minimo: number;
  quantidade_estoque_desativado: number;
}

export interface estatisticasEstoqueProps {
  estatistica_estoque: informacaoEstoqueProps;
  produtos_mais_vendidos: produtoMaisVendidoProps[];
  quantidade_movimentacoes: quantidadeMovimentacoesEstoqueProps[];
}
