import { Cards } from "../Cards";
import { FormEvent, useEffect, useState } from "react";

import { PlaceholderCardInfos } from "../Loaders/PlaceholderCardInfos";
import { Spinner } from "../Loaders/Spinner";
import { Barras } from "../Graficos/Barras";
import {
  graficoBarraDataSetsProps,
  graficoLinhaDataSetsProps,
} from "../../interfaces/interfaceGraficos";
import {
  estatisticaVendasUltimosSeteDias,
  estatisticaVendas,
  vendasFinalizadaProps,
} from "../../interfaces/interfaceRelatorioVendas";
import {
  buscaInformacoesVendasLocalDataAtual,
  buscaListaVendasLocalFinalizadasPeriodo,
  buscaQuantidadeVendasUltimosSeteDias,
} from "../../controllers/RelatorioVendasController";
import { mascaraValorMoedaBrasileira } from "../../controllers/NumeroController";
import { buscaInformacoesVendasLocalPeriodo } from "../../controllers/RelatorioVendasController";
import { TabelaItensVenda } from "../Vendas/TabelaItensVenda";
import { itensVendaProps } from "../../interfaces/interfaceVenda";
import { TabelaVendasFinalizado } from "../Vendas/TabelaVendasFinalizado";
import { listaItensVenda } from "../../controllers/VendaController";
import { Linha } from "../Graficos/Linha";
import { Alerta } from "../Alerta";

export function EstatisticasVenda() {
  const [buscandoEstatisticasAtuais, buscarEstatisticasAtuais] =
    useState(false);
  const [buscandoEstatisticasPeriodo, buscarEstatisticasPeriodo] =
    useState(false);
  const [buscandoItensVenda, buscarItensVenda] = useState(false);

  const [dataInicio, setarDataInicio] = useState<Date | null>(null);
  const [dataFim, setarDataFim] = useState<Date | null>(null);

  const [dadosVendasPeriodo, setarDadosVendasPeriodo] =
    useState<estatisticaVendas>();
  const [dadosVendasAtual, setarDadosVendasAtual] =
    useState<estatisticaVendas>();

  const [labelsGrafico, setarLabelGrafico] = useState<string[]>([]);
  const [dadosGraficoQtdVendas, setarDadosGraficoQtdVendas] = useState<
    graficoBarraDataSetsProps[]
  >([{ data: [], label: "", backgroundColor: "" }]);

  const [dadosGraficoValoresVendas, setarDadosGraficoValoresVendas] = useState<
    graficoLinhaDataSetsProps[]
  >([]);

  const [dadosGraficoQtdFormaPagamentos, setarDadosGraficoFormaPagamentos] =
    useState<graficoBarraDataSetsProps[]>([
      { data: [], label: "", backgroundColor: "" },
    ]);

  const [
    dadosGraficoValoresFormaPagamento,
    setarDadosGraficoValoresFormaPagamento,
  ] = useState<graficoLinhaDataSetsProps[]>([]);

  const [listaVendas, setarListaVendas] = useState<vendasFinalizadaProps[]>([]);
  const [itensVenda, setarItensVenda] = useState<itensVendaProps[]>([]);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function buscaEstatisticasDataAtual() {
    buscarEstatisticasAtuais(true);

    setarDadosVendasAtual(await buscaInformacoesVendasLocalDataAtual());

    const estatisticasVendas = await buscaQuantidadeVendasUltimosSeteDias();

    setarDadosGraficoQtdVendas([
      {
        label: "Normal",
        data: estatisticasVendas.map(
          (quantidadeVendas: estatisticaVendasUltimosSeteDias) => {
            return quantidadeVendas.totalNormal;
          }
        ),
        backgroundColor: "rgb(0,0,139)",
      },
      {
        label: "Fiado",
        data: estatisticasVendas.map(
          (quantidadeVendas: estatisticaVendasUltimosSeteDias) => {
            return quantidadeVendas.totalFiado;
          }
        ),
        backgroundColor: "rgb(100,149,237)",
      },
    ]);

    setarDadosGraficoValoresVendas([
      {
        label: "Valor total de vendas (R$)",
        data: estatisticasVendas.map(
          (valoresVendas: estatisticaVendasUltimosSeteDias) => {
            return valoresVendas.valorTotalVendas;
          }
        ),
        backgroundColor: "rgb(152,251,152)",
        borderColor: "rgb(152,251,152)",
      },
      {
        label: "Valor total de ganhos (R$)",
        data: estatisticasVendas.map(
          (valoresLucros: estatisticaVendasUltimosSeteDias) => {
            return valoresLucros.valorTotalGanhos;
          }
        ),
        backgroundColor: "rgb(0,128,0)",
        borderColor: "rgb(0,128,0)",
      },
    ]);

    setarDadosGraficoFormaPagamentos([
      {
        label: "Vendas cartão",
        data: estatisticasVendas.map(
          (qtdFormasPagamento: estatisticaVendasUltimosSeteDias) =>
            qtdFormasPagamento.totalCartao
        ),
        backgroundColor: "rgb(240,230,140)",
      },
      {
        label: "Vendas dinheiro",
        data: estatisticasVendas.map(
          (qtdFormasPagamento: estatisticaVendasUltimosSeteDias) =>
            qtdFormasPagamento.totalDinheiro
        ),
        backgroundColor: "rgb(255,140,0)",
      },
    ]);

    setarDadosGraficoValoresFormaPagamento([
      {
        label: "Valor total no cartão (R$)",
        data: estatisticasVendas.map(
          (valorFormasPagamento: estatisticaVendasUltimosSeteDias) =>
            valorFormasPagamento.valorTotalCartao
        ),
        backgroundColor: "rgb(75,0,130)",
        borderColor: "rgb(75,0,130)",
      },
      {
        label: "Valor total no dinheiro (R$)",
        data: estatisticasVendas.map(
          (valorFormasPagamento: estatisticaVendasUltimosSeteDias) =>
            valorFormasPagamento.valorTotalDinheiro
        ),
        backgroundColor: "rgb(147,112,219)",
        borderColor: "rgb(147,112,219)",
      },
    ]);

    setarLabelGrafico(
      estatisticasVendas.map((diasVendas: estatisticaVendasUltimosSeteDias) => {
        return diasVendas.dataLabel;
      })
    );

    buscarEstatisticasAtuais(false);
  }

  async function buscaEstatisticasVendaPeriodo() {
    setarDadosVendasPeriodo(
      await buscaInformacoesVendasLocalPeriodo(
        dataInicio?.toISOString() ?? "",
        dataFim?.toISOString() ?? ""
      )
    );
  }

  async function buscaListaVendasLocalPeriodo() {
    setarListaVendas(
      await buscaListaVendasLocalFinalizadasPeriodo(
        dataInicio?.toISOString() ?? "",
        dataFim?.toISOString() ?? ""
      )
    );
  }

  async function buscaInformacoesVendasPeriodo(event: FormEvent) {
    event.preventDefault();

    if (dataInicio !== null && dataFim !== null) {
      if (dataInicio > dataFim) {
        alertarMensagemSistema(
          "warning",
          "A data final não pode ser maior que a data inicial!"
        );
      } else {
        buscarEstatisticasPeriodo(true);
        await buscaEstatisticasVendaPeriodo();
        await buscaListaVendasLocalPeriodo();
        buscarEstatisticasPeriodo(false);
      }
    }
  }

  async function buscaItensVenda(vendaToken: string) {
    buscarItensVenda(true);

    setarItensVenda(await listaItensVenda(vendaToken));

    buscarItensVenda(false);
  }

  useEffect(() => {
    buscaEstatisticasDataAtual();
  }, []);

  return (
    <>
      {mensagemAlerta !== null ? (
        <div className="row mt-4">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="row mt-4">
        <div className="col-12">
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
              <div className="row mt-3 py-3">
                <div className="px-auto d-inline-flex d-lg-flex d-md-flex flex-row align-items-center justify-content-start justify-content-lg-center justify-content-md-center overflow-auto">
                  {!buscandoEstatisticasAtuais ? (
                    <>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Qtd. Total de vendas"
                          valor={dadosVendasAtual?.qtdTotalVendas ?? "0"}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Valor total de vendas"
                          valor={mascaraValorMoedaBrasileira(
                            dadosVendasAtual?.valorTotalVendas ?? 0
                          )}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Valor total de ganhos"
                          valor={mascaraValorMoedaBrasileira(
                            dadosVendasAtual?.valorTotalLucro ?? 0
                          )}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {!buscandoEstatisticasAtuais ? (
                <div
                  className="row mt-3 overflow-auto"
                  style={{ maxHeight: "35rem" }}
                >
                  <div className="d-flex flex-row flex-wrap justify-content-center align-items-center px-auto">
                    <>
                      <div className="col-12 col-md-6 col-lg-6">
                        <Barras
                          tituloGrafico="Quantidade vendas dos ultimos sete dias"
                          labels={labelsGrafico}
                          datasets={dadosGraficoQtdVendas}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-6">
                        <Linha
                          tituloGrafico="Comparativos de valores de vendas e ganhos dos ultimos sete dias"
                          labels={labelsGrafico}
                          datasets={dadosGraficoValoresVendas}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-6">
                        <Barras
                          tituloGrafico="Comparativos de quantidade de vendas em cartão e dinheiro"
                          labels={labelsGrafico}
                          datasets={dadosGraficoQtdFormaPagamentos}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-6">
                        <Linha
                          tituloGrafico="Comparativos de valores de vendas em cartão e dinheiro"
                          labels={labelsGrafico}
                          datasets={dadosGraficoValoresFormaPagamento}
                        />
                      </div>
                    </>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="col-auto">
                    <Spinner />
                  </div>
                </div>
              )}
            </div>
            <div
              className="tab-pane fade"
              id="detalhado-tab-pane"
              role="tabpanel"
              aria-labelledby="detalhado-tab"
              tabIndex={0}
            >
              <form
                onSubmit={buscaInformacoesVendasPeriodo}
                className="row row-cols-lg-auto g-3 mt-5"
              >
                <div className="col-12 col-lg-5 col-md-5">
                  <div className="form-floating">
                    <input
                      type="date"
                      autoComplete="off"
                      className="form-control"
                      id="venDataInicio"
                      disabled={buscandoEstatisticasPeriodo}
                      onChange={(event) =>
                        setarDataInicio(event.target?.valueAsDate)
                      }
                      required
                      placeholder="Data de inicio"
                    />
                    <label htmlFor="venDataInicio">Data de inicio</label>
                  </div>
                </div>
                <div className="col-12 col-lg-5 col-md-5">
                  <div className="form-floating">
                    <input
                      type="date"
                      autoComplete="off"
                      className="form-control"
                      disabled={buscandoEstatisticasPeriodo}
                      id="venDataFim"
                      onChange={(event) =>
                        setarDataFim(event.target?.valueAsDate)
                      }
                      required
                      placeholder="Data final"
                    />
                    <label htmlFor="venDataFim">Data final</label>
                  </div>
                </div>
                <div className="col-12 col-lg-2 col-md-2">
                  <div className="d-grid">
                    {buscandoEstatisticasPeriodo ? (
                      <button
                        className="btn btn-success btn-lg shadow my-1"
                        type="button"
                        disabled
                      >
                        Buscando...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success btn-lg shadow my-1"
                      >
                        Buscar
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <hr />
              <div className="row mt-3 py-3">
                <div className="px-auto d-inline-flex d-lg-flex d-md-flex flex-row align-items-center justify-content-start justify-content-lg-center justify-content-md-center overflow-auto">
                  {!buscandoEstatisticasPeriodo ? (
                    <>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Qtd. Total de vendas"
                          valor={dadosVendasPeriodo?.qtdTotalVendas ?? 0}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Valor total de vendas"
                          valor={mascaraValorMoedaBrasileira(
                            dadosVendasPeriodo?.valorTotalVendas ?? 0
                          )}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <Cards
                          nome="Valor total de ganhos"
                          valor={mascaraValorMoedaBrasileira(
                            dadosVendasPeriodo?.valorTotalLucro ?? 0
                          )}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                      <div className="col-auto col-md-4 col-lg-2 mx-auto">
                        <PlaceholderCardInfos />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <TabelaVendasFinalizado
                    listaVendas={listaVendas}
                    buscandoLista={buscandoEstatisticasPeriodo}
                    buscandoItensVenda={buscandoItensVenda}
                    visualizarItensVenda={(vendaToken) =>
                      buscaItensVenda(vendaToken)
                    }
                  />
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
                  setarItensVenda([]);
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
  );
}
