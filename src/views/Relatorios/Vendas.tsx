import { useEffect, useState } from 'react'
import { Cards } from '../../components/Cards'
import { PlaceholderCardInfos } from '../../components/Loaders/PlaceholderCardInfos'
import {
  adicionaMascaraValor,
  formataValorMoedaBrasileira,
} from '../../controllers/NumeroController'
import {
  estatisticaVendas,
  vendasFinalizadaProps,
} from '../../interfaces/interfaceRelatorioVendas'
import { Barras } from '../../components/Graficos/Barras'
import { Linha } from '../../components/Graficos/Linha'
import {
  graficoBarraDataSetsProps,
  graficoLinhaDataSetsProps,
} from '../../interfaces/interfaceGraficos'
import {
  buscaInformacoesVendasLocalDataAtual,
  buscaInformacoesVendasLocalPeriodo,
  buscaListaVendasLocalFinalizadasPeriodo,
  buscaQuantidadeVendasUltimosSeteDias,
} from '../../controllers/RelatorioVendasController'
import { itensVendaProps } from '../../interfaces/interfaceVenda'
import { TabelaVendasFinalizado } from '../../components/Vendas/TabelaVendasFinalizado'
import {
  listaItensVenda,
  processaCancelamentoVenda,
} from '../../controllers/VendaController'

import { TabelaItensVenda } from '../../components/Vendas/TabelaItensVenda'
import { Alerta } from '../../components/Alerta'
import { FormularioFiltroDiarioRelatorio } from '../../components/Relatorio/FormularioFiltroDiarioRelatorio'
import { LoaderImage } from '../../components/Loaders/LoaderImage'
import imgNenhumDado from '../../assets/images/empty-data.svg'
import { gerarCorAleatorio } from '../../controllers/GraficoControllers'

const Vendas = () => {
  const [buscandoEstatisticasAtuais, buscarEstatisticasAtuais] = useState(false)
  const [cancelandoVenda, cancelarVenda] = useState(false)
  const [buscandoEstatisticasPeriodo, buscarEstatisticasPeriodo] =
    useState(false)
  const [buscandoItensVenda, buscarItensVenda] = useState(false)

  const [dadosVendasPeriodo, setarDadosVendasPeriodo] =
    useState<estatisticaVendas>()
  const [dadosVendasAtual, setarDadosVendasAtual] =
    useState<estatisticaVendas>()

  const [labelsGrafico, setarLabelGrafico] = useState<string[]>([])
  const [dadosGraficoQtdVendas, setarDadosGraficoQtdVendas] = useState<
    graficoBarraDataSetsProps[]
  >([{ data: [], label: '', backgroundColor: '' }])

  const [dadosGraficoValoresVendas, setarDadosGraficoValoresVendas] = useState<
    graficoLinhaDataSetsProps[]
  >([])

  const [dadosGraficoQtdFormaPagamentos, setarDadosGraficoFormaPagamentos] =
    useState<graficoBarraDataSetsProps[]>([
      { data: [], label: '', backgroundColor: '' },
    ])

  const [
    dadosGraficoValoresFormaPagamento,
    setarDadosGraficoValoresFormaPagamento,
  ] = useState<graficoLinhaDataSetsProps[]>([])

  const [labelsGraficoPeriodo, setarLabelGraficoPeriodo] = useState<string[]>(
    [],
  )
  const [dadosGraficoQtdVendasPeriodo, setarDadosGraficoQtdVendasPeriodo] =
    useState<graficoBarraDataSetsProps[]>([
      { data: [], label: '', backgroundColor: '' },
    ])

  const [
    dadosGraficoValoresVendasPeriodo,
    setarDadosGraficoValoresVendasPeriodo,
  ] = useState<graficoLinhaDataSetsProps[]>([])

  const [
    dadosGraficoQtdFormaPagamentosPeriodo,
    setarDadosGraficoFormaPagamentosPeriodo,
  ] = useState<graficoBarraDataSetsProps[]>([
    { data: [], label: '', backgroundColor: '' },
  ])

  const [
    dadosGraficoValoresFormaPagamentoPeriodo,
    setarDadosGraficoValoresFormaPagamentoPeriodo,
  ] = useState<graficoLinhaDataSetsProps[]>([])

  const [listaVendas, setarListaVendas] = useState<vendasFinalizadaProps[]>([])
  const [itensVenda, setarItensVenda] = useState<itensVendaProps[]>([])

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null)
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>('info')

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo)
    alertarMensagem(mensagem)

    setTimeout(() => {
      alertarMensagem(null)
    }, 10000)
  }

  async function buscaEstatisticasDataAtual() {
    buscarEstatisticasAtuais(true)

    setarDadosVendasAtual(await buscaInformacoesVendasLocalDataAtual())

    const estatisticasVendas = await buscaQuantidadeVendasUltimosSeteDias()

    setarLabelGrafico(
      estatisticasVendas.estatisticasVenda.map(
        (dataVenda) => dataVenda.dataLabel,
      ),
    )

    setarDadosGraficoQtdVendas([
      {
        label: 'Normal',
        data: estatisticasVendas.estatisticasVenda.map(
          (vendaNormal) => vendaNormal.totalNormal,
        ),
        backgroundColor: gerarCorAleatorio(),
      },
      {
        label: 'Fiado',
        data: estatisticasVendas.estatisticasVenda.map(
          (vendaFiado) => vendaFiado.totalFiado,
        ),
        backgroundColor: gerarCorAleatorio(),
      },
    ])

    setarDadosGraficoValoresVendas([
      {
        label: 'Receita (R$)',
        data: estatisticasVendas.estatisticasVenda.map(
          (receita) => receita.valorTotalVendas,
        ),
        backgroundColor: 'rgb(152,251,152)',
        borderColor: 'rgb(152,251,152)',
      },
      {
        label: 'Ganhos (R$)',
        data: estatisticasVendas.estatisticasVenda.map(
          (ganho) => ganho.valorTotalGanhos,
        ),
        backgroundColor: 'rgb(0,128,0)',
        borderColor: 'rgb(0,128,0)',
      },
    ])

    const formasPagamento = [
      ...new Set(
        estatisticasVendas.estatisticasVenda.flatMap((venda) =>
          venda.pagamentos.map((pagamento) => pagamento.forma),
        ),
      ),
    ]

    const dadosGraficoQuantidade = formasPagamento.map((forma) => {
      const quantidadeVendasPorData = estatisticasVendas.estatisticasVenda.map(
        (venda) => {
          const pagamento = venda.pagamentos.find((p) => p.forma === forma)

          return pagamento ? pagamento.quantidade : 0
        },
      )

      return {
        label: forma,
        data: quantidadeVendasPorData,
        backgroundColor: gerarCorAleatorio(),
      }
    })

    const dadosGraficoValores = formasPagamento.map((forma) => {
      const valoresVendasPorData = estatisticasVendas.estatisticasVenda.map(
        (venda) => {
          const pagamento = venda.pagamentos.find((p) => p.forma === forma)

          return pagamento ? pagamento.total : 0
        },
      )

      const corGrafico = gerarCorAleatorio()
      return {
        label: forma,
        data: valoresVendasPorData,
        backgroundColor: corGrafico,
        borderColor: corGrafico,
      }
    })

    setarDadosGraficoFormaPagamentos(dadosGraficoQuantidade)
    setarDadosGraficoValoresFormaPagamento(dadosGraficoValores)

    buscarEstatisticasAtuais(false)
  }

  async function buscaEstatisticasVendaPeriodo(
    dataInicio: string,
    dataFim: string,
  ) {
    const dadosEstatisticas = await buscaInformacoesVendasLocalPeriodo(
      dataInicio ?? '',
      dataFim ?? '',
    )

    setarDadosVendasPeriodo(dadosEstatisticas)

    setarLabelGraficoPeriodo(
      dadosEstatisticas.estatisticasVenda.map((diasVendas) => {
        return diasVendas.dataLabel
      }),
    )

    setarDadosGraficoQtdVendasPeriodo([
      {
        label: 'Normal',
        data: dadosEstatisticas.estatisticasVenda.map((quantidadeVendas) => {
          return quantidadeVendas.totalNormal
        }),
        backgroundColor: gerarCorAleatorio(),
      },
      {
        label: 'Fiado',
        data: dadosEstatisticas.estatisticasVenda.map((quantidadeVendas) => {
          return quantidadeVendas.totalFiado
        }),
        backgroundColor: gerarCorAleatorio(),
      },
    ])

    setarDadosGraficoValoresVendasPeriodo([
      {
        label: 'Receitas (R$)',
        data: dadosEstatisticas.estatisticasVenda.map((valoresVendas) => {
          return valoresVendas.valorTotalVendas
        }),
        backgroundColor: 'rgb(152,251,152)',
        borderColor: 'rgb(152,251,152)',
      },
      {
        label: 'Ganhos (R$)',
        data: dadosEstatisticas.estatisticasVenda.map((valoresLucros) => {
          return valoresLucros.valorTotalGanhos
        }),
        backgroundColor: 'rgb(0,128,0)',
        borderColor: 'rgb(0,128,0)',
      },
    ])

    const formasPagamento = [
      ...new Set(
        dadosEstatisticas.estatisticasVenda.flatMap((venda) =>
          venda.pagamentos.map((pagamento) => pagamento.forma),
        ),
      ),
    ]

    const dadosGraficoQuantidade = formasPagamento.map((forma) => {
      const quantidadeVendasPorData = dadosEstatisticas.estatisticasVenda.map(
        (venda) => {
          const pagamento = venda.pagamentos.find((p) => p.forma === forma)

          return pagamento ? pagamento.quantidade : 0
        },
      )

      return {
        label: forma,
        data: quantidadeVendasPorData,
        backgroundColor: gerarCorAleatorio(),
      }
    })

    const dadosGraficoValores = formasPagamento.map((forma) => {
      const valoresVendasPorData = dadosEstatisticas.estatisticasVenda.map(
        (venda) => {
          const pagamento = venda.pagamentos.find((p) => p.forma === forma)

          return pagamento ? pagamento.total : 0
        },
      )

      const corGrafico = gerarCorAleatorio()
      return {
        label: forma,
        data: valoresVendasPorData,
        backgroundColor: corGrafico,
        borderColor: corGrafico,
      }
    })

    setarDadosGraficoFormaPagamentosPeriodo(dadosGraficoQuantidade)

    setarDadosGraficoValoresFormaPagamentoPeriodo(dadosGraficoValores)
  }

  async function buscaListaVendasLocalPeriodo(
    dataInicio: string,
    dataFim: string,
  ) {
    setarListaVendas(
      await buscaListaVendasLocalFinalizadasPeriodo(dataInicio, dataFim),
    )
  }

  async function buscaInformacoesVendasPeriodo(
    dataInicio: string,
    dataFim: string,
  ) {
    buscarEstatisticasPeriodo(true)
    await buscaEstatisticasVendaPeriodo(dataInicio, dataFim)
    await buscaListaVendasLocalPeriodo(dataInicio, dataFim)
    buscarEstatisticasPeriodo(false)
  }

  async function buscaItensVenda(vendaToken: string) {
    buscarItensVenda(true)

    setarItensVenda(await listaItensVenda(vendaToken))

    buscarItensVenda(false)
  }

  async function cancelaVenda(vendaToken: string) {
    cancelarVenda(true)
    await processaCancelamentoVenda(vendaToken)
    cancelarVenda(false)
    setarListaVendas([])
  }

  useEffect(() => {
    buscaEstatisticasDataAtual()
  }, [])

  return (
    <>
      {mensagemAlerta !== null ? (
        <div className="row">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div>
        <ul
          className="nav nav-tabs justify-content-center"
          id="myTab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link text-bg-light active"
              id="geral-tab"
              data-bs-toggle="tab"
              data-bs-target="#geral-tab-pane"
              type="button"
              role="tab"
              aria-controls="geral-tab-pane"
              aria-selected="true"
            >
              Estatísticas atual
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link text-bg-light"
              id="detalhado-tab"
              data-bs-toggle="tab"
              data-bs-target="#detalhado-tab-pane"
              type="button"
              role="tab"
              aria-controls="detalhado-tab-pane"
              aria-selected="false"
            >
              Buscar estatísticas
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="geral-tab-pane"
            role="tabpanel"
            aria-labelledby="geral-tab"
            tabIndex={0}
          >
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-start justify-content-xl-center overflow-auto gap-2 py-3 px-3 px-xl-0">
                {!buscandoEstatisticasAtuais ? (
                  <>
                    <div className="col-auto">
                      <Cards
                        nome="Qtd. Total de vendas"
                        valor={dadosVendasAtual?.qtdTotalVendas ?? '0'}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Valor total de vendas"
                        valor={formataValorMoedaBrasileira(
                          dadosVendasAtual?.valorTotalVendas ?? 0,
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Ganhos (R$)"
                        valor={formataValorMoedaBrasileira(
                          dadosVendasAtual?.valorTotalLucro ?? 0,
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Ganhos (%)"
                        valor={adicionaMascaraValor(
                          dadosVendasAtual?.porcentagemTotalLucro.toString() ??
                            '0',
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                  </>
                )}
              </div>
              {buscandoEstatisticasAtuais ? (
                <LoaderImage />
              ) : (
                <div className="row row-cols-1 row-cols-lg-2 mt-2 mb-2">
                  <div className="col-12 col-md-6 col-lg-6">
                    <Barras
                      tituloGrafico="Vendas dos últimos sete dias"
                      labels={labelsGrafico}
                      datasets={dadosGraficoQtdVendas}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <Linha
                      tituloGrafico="Receitas e ganhos dos últimos sete dias"
                      labels={labelsGrafico}
                      datasets={dadosGraficoValoresVendas}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <Barras
                      tituloGrafico="Qtd. vendas pagas"
                      labels={labelsGrafico}
                      datasets={dadosGraficoQtdFormaPagamentos}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <Linha
                      tituloGrafico="Valores pagos"
                      labels={labelsGrafico}
                      datasets={dadosGraficoValoresFormaPagamento}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="detalhado-tab-pane"
            role="tabpanel"
            aria-labelledby="detalhado-tab"
            tabIndex={0}
          >
            <div className="d-flex flex-column">
              <FormularioFiltroDiarioRelatorio
                filtrandoRelatorio={buscandoEstatisticasPeriodo}
                filtrarRelatorio={buscaInformacoesVendasPeriodo}
                alertarMensagem={alertarMensagemSistema}
              />
              <hr />
              <div className="d-flex justify-content-start justify-content-xl-center overflow-auto gap-2 py-3 px-3 px-xl-0">
                {!buscandoEstatisticasPeriodo ? (
                  <>
                    <div className="col-auto">
                      <Cards
                        nome="Qtd. Total de vendas"
                        valor={dadosVendasPeriodo?.qtdTotalVendas ?? 0}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Valor total de vendas"
                        valor={formataValorMoedaBrasileira(
                          dadosVendasPeriodo?.valorTotalVendas ?? 0,
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Ganhos (R$)"
                        valor={formataValorMoedaBrasileira(
                          dadosVendasPeriodo?.valorTotalLucro ?? 0,
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                    <div className="col-auto">
                      <Cards
                        nome="Ganhos (%)"
                        valor={adicionaMascaraValor(
                          dadosVendasPeriodo?.porcentagemTotalLucro.toString() ??
                            '0',
                        )}
                        cor={'text-bg-secondary bg-secondary bg-gradient'}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                    <div className="col-auto">
                      <PlaceholderCardInfos />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-3">
                <ul
                  className="nav nav-tabs justify-content-center"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-bg-light active"
                      id="visao-geral-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#visao-geral-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="visao-geral-tab-pane"
                      aria-selected="true"
                    >
                      Visão Geral
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link text-bg-light"
                      id="mais-detalhes-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#mais-detalhes-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="mais-detalhes-tab-pane"
                      aria-selected="false"
                    >
                      Mais detalhes
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="visao-geral-tab-pane"
                    role="tabpanel"
                    aria-labelledby="visao-geral-tab"
                    tabIndex={0}
                  >
                    {buscandoEstatisticasPeriodo ? (
                      <div className="mt-3">
                        <LoaderImage />
                      </div>
                    ) : !dadosVendasPeriodo ? (
                      <div className="d-flex flex-column gap-3 p-3">
                        <strong className="h4 text-center">
                          Nenhuma informação pesquisado!
                        </strong>
                        <div className="d-flex justify-content-center">
                          <img
                            src={imgNenhumDado}
                            alt="Nenhuma informação encontrado"
                            className="img-thumbnail border-0 imagem-vazio"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row row-cols-1 row-cols-lg-2 mt-2 mb-2">
                        <div className="col-12 col-md-6 col-lg-6">
                          <Barras
                            tituloGrafico="Quantidade de vendas"
                            labels={labelsGraficoPeriodo}
                            datasets={dadosGraficoQtdVendasPeriodo}
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                          <Linha
                            tituloGrafico="Valores de receitas e ganhos"
                            labels={labelsGraficoPeriodo}
                            datasets={dadosGraficoValoresVendasPeriodo}
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                          <Barras
                            tituloGrafico="Qtd. vendas pagas"
                            labels={labelsGraficoPeriodo}
                            datasets={dadosGraficoQtdFormaPagamentosPeriodo}
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                          <Linha
                            tituloGrafico="Valores de vendas pagas"
                            labels={labelsGraficoPeriodo}
                            datasets={dadosGraficoValoresFormaPagamentoPeriodo}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="mais-detalhes-tab-pane"
                    role="tabpanel"
                    aria-labelledby="mais-detalhes-tab"
                    tabIndex={0}
                  >
                    <div className="col-12">
                      <TabelaVendasFinalizado
                        listaVendas={listaVendas}
                        buscandoLista={buscandoEstatisticasPeriodo}
                        buscandoItensVenda={buscandoItensVenda}
                        visualizarItensVenda={buscaItensVenda}
                        cancelandoVenda={cancelandoVenda}
                        cancelarVenda={cancelaVenda}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="itensCompradoVendaModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="itensCompradoVendaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="itensCompradoVendaModalLabel"
              >
                Itens comprados
              </h1>
              <button
                type="button"
                className="btn-close"
                disabled={buscandoItensVenda}
                onClick={() => {
                  setarItensVenda([])
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TabelaItensVenda
                listaItensVenda={itensVenda}
                carregandoListaItens={buscandoItensVenda}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Vendas
