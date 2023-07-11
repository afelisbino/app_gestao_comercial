export interface estatisticaVendas {
  qtdTotalVendas: number
  valorTotalVendas: number
  valorTotalLucro: number
  porcentagemTotalLucro: number
  estatisticasVenda: Array<estatisticaValoresVendas>
}

export interface estatisticaValoresVendas {
  dataLabel: string
  totalFiado: number
  totalNormal: number
  valorTotalVendas: number
  valorTotalGanhos: number
  pagamentos: Array<estatisticasPagamentosVendas>
}

export interface estatisticasPagamentosVendas {
  forma: string
  quantidade: number
  total: number
}

export interface vendasFinalizadaProps {
  ven_id: string
  ven_data: string
  ven_tipo: string
  ven_pagamento: string
  ven_valor_compra: number
  ven_desconto: number
  ven_total: number
  ven_lucro: number
  ven_porcentagem_lucro: number
}
