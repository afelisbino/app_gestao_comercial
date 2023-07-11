import { retornoRequisicaoProps } from '../interfaces/interfaceReturnoRequisicao'
import instanciaAxios from '../libraries/AxiosInstance'

import { fornecedorProps } from './../interfaces/interfaceFornecedor'

export async function buscarListaFornecedores(): Promise<fornecedorProps[]> {
  return await instanciaAxios
    .get<fornecedorProps[]>('fornecedor/listar')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return []
    })
}

export async function buscaDadosFornecedor(
  idFornecedor: string,
): Promise<fornecedorProps> {
  return await instanciaAxios
    .get<fornecedorProps>('fornecedor/buscar', {
      params: {
        tokenFornecedor: idFornecedor,
      },
    })
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return { frn_id: '', frn_nome: '' }
    })
}

export async function atualizaDadosFornecedor(
  nomeFornecedor: string,
  tokenFornecedor: string | null,
  documentoFornecedor?: string | null,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .put<retornoRequisicaoProps>(
      'fornecedor/editar',
      {
        nomeFornecedor,
        documentoFornecedor,
        tokenFornecedor,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
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

export async function cadastraFornecedor(
  nomeFornecedor: string,
  documentoFornecedor?: string | null,
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post<retornoRequisicaoProps>(
      'fornecedor/cadastrar',
      JSON.stringify({
        nomeFornecedor,
        documentoFornecedor: documentoFornecedor ?? null,
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
