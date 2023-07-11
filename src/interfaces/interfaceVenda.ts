export interface vendaFiadoProps {
  ven_id: string
  ven_cliente: string
  ven_data: string
  ven_total: number
}

export interface itensVendaProps {
  scl_id: string
  pro_nome: string
  pro_valor: number
  scl_qtd: number
  scl_sub_total: number
}

export interface pagamentoVenda {
  pagamentoId: string
  formaPagamentoNome?: string | null
  formaPagamentoToken: string
  valorPago: number
}
