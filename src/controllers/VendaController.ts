import { retornoRequisicaoProps } from './../interfaces/interfaceReturnoRequisicao'
import instanciaAxios from '../libraries/AxiosInstance'
import {
  itensVendaProps,
  pagamentoVenda,
  vendaFiadoProps,
} from '../interfaces/interfaceVenda'
import { itemSacolaProp } from '../interfaces/interfaceSacola'

interface formaPagamentoProps {
  valor: string
  nome: string
}

export const tiposPagamentos: formaPagamentoProps[] = [
  {
    valor: 'dinheiro',
    nome: 'Dinheiro',
  },
  {
    valor: 'cartao',
    nome: 'Cartão',
  },
  {
    valor: 'pix',
    nome: 'Pix',
  },
]

export async function finalizarVendaLocalNormal(
  totalCompra: number,
  valorDesconto: number,
  itensSacola: itemSacolaProp[],
  formaPagamento: pagamentoVenda[],
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post<retornoRequisicaoProps>(
      'venda/registrar/local/normal',
      JSON.stringify({
        vendaValorCompra: totalCompra,
        vendaValorDesconto: valorDesconto,
        itens: itensSacola,
        formaPagamento,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return { status: false, msg: 'Erro ao processar, tente novamente!' }
    })
}

export async function finalizarVendaLocalFiado(
  totalCompra: number,
  nomeCliente: string,
  itensSacola: itemSacolaProp[],
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post<retornoRequisicaoProps>(
      'venda/registrar/local/fiado',
      JSON.stringify({
        vendaValorCompra: totalCompra,
        vendaValorDesconto: 0,
        nomeCliente,
        itens: itensSacola,
        formaPagamento: [],
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return { status: false, msg: 'Erro ao processar, tente novamente!' }
    })
}

export async function listaVendaFiadoAberto(): Promise<vendaFiadoProps[]> {
  return await instanciaAxios
    .get('venda/listar/fiado')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return []
    })
}

export async function listaItensVenda(
  tokenVenda: string,
): Promise<itensVendaProps[]> {
  return await instanciaAxios
    .get('venda/listar/itens', {
      params: {
        tokenVenda,
      },
    })
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return []
    })
}

export async function processaPagamentoVendaFiado(
  tokenVenda: Array<string>,
  formaPagamento: pagamentoVenda[],
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .patch(
      'venda/fiado/pagar',
      JSON.stringify({
        tokenVenda,
        formaPagamento,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return { status: false, msg: 'Erro ao processar, tente novamente!' }
    })
}

export async function processaCancelamentoVenda(
  tokenVenda: string,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .put(
      'venda/cancelar',
      JSON.stringify({
        tokenVenda,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return { status: false, msg: 'Erro ao processar, tente novamente!' }
    })
}
