import { useState } from "react";
import { Alerta } from "../../components/Alerta";
import { FormularioFiltroDiarioRelatorio } from "../../components/Relatorio/FormularioFiltroDiarioRelatorio";
import { relatorioCaixa } from "../../interfaces/interfaceRelatorioCaixa";
import { Spinner } from "../../components/Loaders/Spinner";
import { EstatisticasCaixaEmpresa } from "../../components/Relatorio/EstatisticasCaixaEmpresa";
import { FormularioFiltroMensalRelatorio } from "../../components/Relatorio/FormularioFiltroMensalRelatorio";
import { FormularioFiltroAnualRelatorio } from "../../components/Relatorio/FormularioFiltroAnualRelatorio";
import {
  buscaEstatisticasCaixaAnual,
  buscaEstatisticasCaixaMensal,
  buscaEstatisticasCaixaPeriodo,
} from "../../controllers/RelatorioCaixaController";

const Caixa = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [buscandoEstatisticasPeriodo, processarBuscaEstatisticasPeriodo] =
    useState(false);
  const [buscandoEstatisticasMensal, processarBuscaEstatisticasMensal] =
    useState(false);
  const [buscandoEstatisticasAnual, processarBuscaEstatisticasAnual] =
    useState(false);

  const [dadosEstatisticaCaixaPeriodo, setarDadosEstatisticaCaixaPeriodo] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        porcentagemTotalLucro: 0,
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
          porcentagemLucro: 0,
        },
      ],
    });

  const [dadosEstatisticaCaixaMensal, setarDadosEstatisticaCaixaMensal] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        porcentagemTotalLucro: 0,
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
          porcentagemLucro: 0,
        },
      ],
    });

  const [dadosEstatisticaCaixaAnual, setarDadosEstatisticaCaixaAnual] =
    useState<relatorioCaixa>({
      resumo: {
        valorTotalEntrada: 0,
        valorTotalLucro: 0,
        porcentagemTotalLucro: 0,
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
          porcentagemLucro: 0,
        },
      ],
    });

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function buscarInformacoesCaixaPeriodo(
    dataInicio: string | null,
    dataFim: string | null
  ) {
    processarBuscaEstatisticasPeriodo(true);

    setarDadosEstatisticaCaixaPeriodo(
      await buscaEstatisticasCaixaPeriodo(dataInicio ?? "", dataFim ?? "")
    );

    processarBuscaEstatisticasPeriodo(false);
  }

  async function buscarInformacoesCaixaMensal(
    mesInicio: string | null,
    mesFim: string | null
  ) {
    processarBuscaEstatisticasMensal(true);

    setarDadosEstatisticaCaixaMensal(
      await buscaEstatisticasCaixaMensal(mesInicio ?? "", mesFim ?? "")
    );

    processarBuscaEstatisticasMensal(false);
  }

  async function buscarInformacoesCaixaAnual(
    anoInicio: string | null,
    anoFim: string | null
  ) {
    processarBuscaEstatisticasAnual(true);

    setarDadosEstatisticaCaixaAnual(
      await buscaEstatisticasCaixaAnual(anoInicio ?? "", anoFim ?? "")
    );

    processarBuscaEstatisticasAnual(false);
  }

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
      <div className="row">
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
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="diario-tab-pane"
            role="tabpanel"
            aria-labelledby="diario-tab"
            tabIndex={0}
          >
            <div className="d-flex flex-column">
              <FormularioFiltroDiarioRelatorio
                filtrandoRelatorio={buscandoEstatisticasPeriodo}
                filtrarRelatorio={buscarInformacoesCaixaPeriodo}
                alertarMensagem={alertarMensagemSistema}
              />
              <hr />
              {buscandoEstatisticasPeriodo ? (
                <div className="row mt-2">
                  <Spinner />
                </div>
              ) : (
                <EstatisticasCaixaEmpresa
                  dados={dadosEstatisticaCaixaPeriodo}
                />
              )}
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="mensal-tab-pane"
            role="tabpanel"
            aria-labelledby="mensal-tab"
            tabIndex={0}
          >
            <FormularioFiltroMensalRelatorio
              filtrandoRelatorio={buscandoEstatisticasMensal}
              filtrarRelatorio={buscarInformacoesCaixaMensal}
              alertarMensagem={alertarMensagemSistema}
            />
            {buscandoEstatisticasMensal ? (
              <div className="row mt-2">
                <Spinner />
              </div>
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
            <FormularioFiltroAnualRelatorio
              filtrandoRelatorio={buscandoEstatisticasAnual}
              filtrarRelatorio={buscarInformacoesCaixaAnual}
              alertarMensagem={alertarMensagemSistema}
            />
            {buscandoEstatisticasAnual ? (
              <div className="row mt-2">
                <Spinner />
              </div>
            ) : (
              <EstatisticasCaixaEmpresa dados={dadosEstatisticaCaixaAnual} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Caixa;
