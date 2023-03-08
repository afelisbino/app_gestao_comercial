import { useState, FormEvent } from "react";
import { EstatisticasCaixaEmpresa } from "../Caixa/EstatisticasCaixaEmpresa";
import { relatorioCaixa } from "../../interfaces/interfaceRelatorioCaixa";
import { Alerta } from "../Alerta";
import {
  buscaEstatisticasCaixaAnual,
  buscaEstatisticasCaixaMensal,
  buscaEstatisticasCaixaPeriodo,
} from "../../controllers/RelatorioCaixaController";
import { Spinner } from "../Loaders/Spinner";

export function EstatisticasCaixa() {
  const [dataInicio, setarDataInicio] = useState<Date | null>(null);
  const [dataFim, setarDataFim] = useState<Date | null>(null);

  const [mesInicio, setarMesInicio] = useState<Date | null>(null);
  const [mesFim, setarMesFim] = useState<Date | null>(null);

  const [anoInicio, setarAnoInicio] = useState<string | null>(null);
  const [anoFim, setarAnoFim] = useState<string | null>(null);

  const [dadosEstatisticaCaixaPeriodo, setarDadosEstatisticaCaixaPeriodo] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        valorTotalReceita: 0,
        valorTotalSaida: 0,
      },
      fechamento: [
        {
          data: "",
          valorFechamento: 0,
        },
      ],
      valoresMovimentacoes: [
        {
          data: "",
          valorEntrada: 0,
          valorSaida: 0,
        },
      ],
      valoresReceitaLucro: [
        {
          data: "",
          valorReceita: 0,
          valorLucro: 0,
        },
      ],
    });

  const [dadosEstatisticaCaixaMensal, setarDadosEstatisticaCaixaMensal] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        valorTotalReceita: 0,
        valorTotalSaida: 0,
      },
      fechamento: [
        {
          data: "",
          valorFechamento: 0,
        },
      ],
      valoresMovimentacoes: [
        {
          data: "",
          valorEntrada: 0,
          valorSaida: 0,
        },
      ],
      valoresReceitaLucro: [
        {
          data: "",
          valorReceita: 0,
          valorLucro: 0,
        },
      ],
    });

  const [dadosEstatisticaCaixaAnual, setarDadosEstatisticaCaixaAnual] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        valorTotalReceita: 0,
        valorTotalSaida: 0,
      },
      fechamento: [
        {
          data: "",
          valorFechamento: 0,
        },
      ],
      valoresMovimentacoes: [
        {
          data: "",
          valorEntrada: 0,
          valorSaida: 0,
        },
      ],
      valoresReceitaLucro: [
        {
          data: "",
          valorReceita: 0,
          valorLucro: 0,
        },
      ],
    });

  const [buscandoEstatisticasPeriodo, processarBuscaEstatisticasPeriodo] =
    useState(false);
  const [buscandoEstatisticasMensal, processarBuscaEstatisticasMensal] =
    useState(false);
  const [buscandoEstatisticasAnual, processarBuscaEstatisticasAnual] =
    useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function buscarInformacoesCaixaPeriodo(event: FormEvent) {
    event.preventDefault();

    if (dataInicio !== null && dataFim !== null) {
      if (dataInicio > dataFim) {
        alertarMensagemSistema(
          "warning",
          "A data inicial não pode ser maior que o final!"
        );
      } else {
        processarBuscaEstatisticasPeriodo(true);

        setarDadosEstatisticaCaixaPeriodo(
          await buscaEstatisticasCaixaPeriodo(
            dataInicio?.toISOString() ?? "",
            dataFim?.toISOString() ?? ""
          )
        );

        processarBuscaEstatisticasPeriodo(false);
      }
    }
  }

  async function buscarInformacoesCaixaMensal(event: FormEvent) {
    event.preventDefault();

    if (mesInicio !== null && mesFim !== null) {
      if (mesInicio > mesFim) {
        alertarMensagemSistema(
          "warning",
          "O mes inicial não pode ser maior que o final!"
        );
      } else {
        processarBuscaEstatisticasMensal(true);

        setarDadosEstatisticaCaixaMensal(
          await buscaEstatisticasCaixaMensal(
            mesInicio?.toISOString() ?? "",
            mesFim?.toISOString() ?? ""
          )
        );

        processarBuscaEstatisticasMensal(false);
      }
    }
  }

  async function buscarInformacoesCaixaAnual(event: FormEvent) {
    event.preventDefault();

    if (Number(anoInicio) > Number(anoFim)) {
      alertarMensagemSistema(
        "warning",
        "O ano inicial não pode ser maior que o final!"
      );
    } else {
      processarBuscaEstatisticasAnual(true);

      setarDadosEstatisticaCaixaAnual(
        await buscaEstatisticasCaixaAnual(anoInicio ?? "", anoFim ?? "")
      );

      processarBuscaEstatisticasAnual(false);
    }
  }

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
      <div className="row mt-5">
        <div className="col-12">
          <ul
            className="nav nav-tabs justify-content-center"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light active"
                id="atual-tab"
                data-bs-toggle="tab"
                data-bs-target="#diario-tab-pane"
                type="button"
                role="tab"
                aria-controls="diario-tab-pane"
                aria-selected="true"
              >
                Caixa Diário
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="mensal-tab"
                data-bs-toggle="tab"
                data-bs-target="#mensal-tab-pane"
                type="button"
                role="tab"
                aria-controls="mensal-tab-pane"
                aria-selected="false"
              >
                Caixa mensal
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="anual-tab"
                data-bs-toggle="tab"
                data-bs-target="#anual-tab-pane"
                type="button"
                role="tab"
                aria-controls="anual-tab-pane"
                aria-selected="false"
              >
                Caixa anual
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="diario-tab-pane"
            role="tabpanel"
            aria-labelledby="diario-tab"
            tabIndex={0}
          >
            <form onSubmit={buscarInformacoesCaixaPeriodo} className="row mt-3">
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="date"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaDataInicio"
                    required
                    placeholder="Data Inicial"
                    disabled={buscandoEstatisticasPeriodo}
                    onChange={(event) =>
                      setarDataInicio(event.target.valueAsDate)
                    }
                  />
                  <label htmlFor="filtroCaixaDataInicio">Data Inicial</label>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="date"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaDataFim"
                    disabled={buscandoEstatisticasPeriodo}
                    required
                    placeholder="Data final"
                    onChange={(event) => setarDataFim(event.target.valueAsDate)}
                  />
                  <label htmlFor="filtroCaixaDataFinal">Data final</label>
                </div>
              </div>
              <div className="col-12 col-lg-2 col-md-2">
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={buscandoEstatisticasPeriodo}
                    className="btn btn-success btn-lg shadow my-1"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>
            <hr />
            {buscandoEstatisticasPeriodo ? (
              <Spinner />
            ) : (
              <EstatisticasCaixaEmpresa dados={dadosEstatisticaCaixaPeriodo} />
            )}
          </div>
          <div
            className="tab-pane fade"
            id="mensal-tab-pane"
            role="tabpanel"
            aria-labelledby="mensal-tab"
            tabIndex={0}
          >
            <form onSubmit={buscarInformacoesCaixaMensal} className="row mt-3">
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="month"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaMesInicio"
                    disabled={buscandoEstatisticasMensal}
                    required
                    placeholder="Mes Inicial"
                    onChange={(event) =>
                      setarMesInicio(event.target.valueAsDate)
                    }
                  />
                  <label htmlFor="filtroCaixaMesInicio">Mes Inicial</label>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="month"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaMesFim"
                    disabled={buscandoEstatisticasMensal}
                    required
                    placeholder="Mes final"
                    onChange={(event) => setarMesFim(event.target.valueAsDate)}
                  />
                  <label htmlFor="filtroCaixaMesFinal">Mes final</label>
                </div>
              </div>
              <div className="col-12 col-lg-2 col-md-2">
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={buscandoEstatisticasMensal}
                    className="btn btn-success btn-lg shadow my-1"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>
            <hr />
            {buscandoEstatisticasMensal ? (
              <Spinner />
            ) : (
              <EstatisticasCaixaEmpresa dados={dadosEstatisticaCaixaMensal} />
            )}
          </div>
          <div
            className="tab-pane fade"
            id="anual-tab-pane"
            role="tabpanel"
            aria-labelledby="anual-tab"
            tabIndex={0}
          >
            <form onSubmit={buscarInformacoesCaixaAnual} className="row mt-3">
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaAnoInicio"
                    disabled={buscandoEstatisticasAnual}
                    required
                    placeholder="Ano Inicial"
                    onChange={(event) => setarAnoInicio(event.target.value)}
                  />
                  <label htmlFor="filtroCaixaAnoInicio">Ano Inicial</label>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-md-5">
                <div className="form-floating">
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    id="filtroCaixaAnoFim"
                    disabled={buscandoEstatisticasAnual}
                    onChange={(event) => setarAnoFim(event.target.value)}
                    required
                    placeholder="Ano final"
                  />
                  <label htmlFor="filtroCaixaAnoFinal">Ano final</label>
                </div>
              </div>
              <div className="col-12 col-lg-2 col-md-2">
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={buscandoEstatisticasAnual}
                    className="btn btn-success btn-lg shadow my-1"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>
            <hr />
            {buscandoEstatisticasAnual ? (
              <Spinner />
            ) : (
              <EstatisticasCaixaEmpresa dados={dadosEstatisticaCaixaAnual} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
