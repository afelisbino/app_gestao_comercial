import {
  estatisticaVendas,
  vendasFinalizadaProps,
} from '../interfaces/interfaceRelatorioVendas'
import instanciaAxios from '../libraries/AxiosInstance'

export async function buscaInformacoesVendasLocalDataAtual(): Promise<estatisticaVendas> {
  return await instanciaAxios
    .get<estatisticaVendas>('relatorio/venda/local/info')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return {
        qtdTotalVendas: 0,
        valorTotalLucro: 0,
        valorTotalVendas: 0,
        porcentagemTotalLucro: 0,
        estatisticasVenda: [],
      }
    })
}

export async function buscaInformacoesVendasLocalPeriodo(
  dataInicio: string,
  dataFim: string,
): Promise<estatisticaVendas> {
  return await instanciaAxios
    .get<estatisticaVendas>('relatorio/venda/local/info', {
      params: {
        dataInicio,
        dataFim,
      },
    })
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return {
        qtdTotalVendas: 0,
        valorTotalLucro: 0,
        valorTotalVendas: 0,
        porcentagemTotalLucro: 0,
        estatisticasVenda: [],
      }
    })
}

export async function buscaListaVendasLocalFinalizadasPeriodo(
  dataInicio: string,
  dataFim: string,
): Promise<vendasFinalizadaProps[]> {
  return await instanciaAxios
    .get<vendasFinalizadaProps[]>('relatorio/venda/local/lista', {
      params: {
        dataInicio,
        dataFim,
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

export async function buscaQuantidadeVendasUltimosSeteDias(): Promise<estatisticaVendas> {
  return await instanciaAxios
    .get<estatisticaVendas>('relatorio/venda/local/estatisticas/geral')
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return {
        porcentagemTotalLucro: 0,
        qtdTotalVendas: 0,
        valorTotalLucro: 0,
        valorTotalVendas: 0,
        estatisticasVenda: [],
      }
    })
}
