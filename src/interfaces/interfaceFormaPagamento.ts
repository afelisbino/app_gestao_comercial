export interface categoriaFormaPgamento {
  codigo: number
  nome: string
}

export interface formaPagamento {
  token: string
  status: boolean
  nome: string
  categoria: string
}
