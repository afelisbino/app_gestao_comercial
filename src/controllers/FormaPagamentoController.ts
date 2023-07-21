import {
  categoriaFormaPgamento,
  formaPagamento,
} from '../interfaces/interfaceFormaPagamento'
import { retornoRequisicaoProps } from '../interfaces/interfaceReturnoRequisicao'
import instanciaAxios from '../libraries/AxiosInstance'

export async function buscarListaCategoriaFormaCarregamento(): Promise<
  categoriaFormaPgamento[]
> {
  return await instanciaAxios
    .get('tipo_pagamento/categorias')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return []
    })
}

export async function salvaFormaPagamento(
  nome: string,
  categoria: string,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post(
      'tipo_pagamento/cadastrar',
      JSON.stringify({
        nomeTipoPagamento: nome,
        categoriaTipoPagamento: categoria,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)

      return {
        status: false,
        msg: 'Houve um erro durante o processamento, tente novamente!',
      }
    })
}

export async function atualizaFormaPagamento(
  token: string,
  nome: string,
  categoria: string,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .put(
      'tipo_pagamento/atualizar',
      JSON.stringify({
        nomeTipoPagamento: nome,
        categoriaTipoPagamento: categoria,
        tokenTipoPagamento: token,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)

      return {
        status: false,
        msg: 'Houve um erro durante o processamento, tente novamente!',
      }
    })
}

export async function atualizaStatusFormaPagamento(
  token: string,
  ativo: boolean,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .patch(
      'tipo_pagamento/alterar_status',
      JSON.stringify({
        ativoTipoPagamento: ativo,
        tokenTipoPagamento: token,
      }),
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)

      return {
        status: false,
        msg: 'Houve um erro durante o processamento, tente novamente!',
      }
    })
}

export async function buscaListaFormaPagamento(): Promise<formaPagamento[]> {
  return await instanciaAxios
    .get('tipo_pagamento/listar')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return []
    })
}
