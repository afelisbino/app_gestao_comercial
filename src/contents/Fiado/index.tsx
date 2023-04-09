import { useEffect, useState } from "react";
import { TabelaItensVenda } from "../../components/Vendas/TabelaItensVenda";
import {
  itensVendaProps,
  vendaFiadoProps,
} from "../../interfaces/interfaceVenda";
import {
  listaItensVenda,
  listaVendaFiadoAberto,
  processaPagamentoVendaFiado,
  tiposPagamentos,
} from "../../controllers/VendaController";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { TabelaVendasFiadoAberto } from "../../components/Vendas/Fiado/TabelaVendasFiadoAberto";

const Fiado = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [tipoPagamento, selecionarTipoPagamento] = useState<string>("");
  const [tokenVenda, setarTokenVenda] = useState<string>("");

  const [carregandoListaVendasFiados, carregarListaVendas] = useState(false);
  const [carregandoListaItensVenda, carregarListaItensVenda] = useState(false);
  const [processandoPagamento, processarPagamentoVendaFiado] = useState(false);

  const [listaItensSacolaVenda, setarListaItensSacolaVenda] = useState<
    itensVendaProps[]
  >([]);
  const [listaVendasFiado, setarListaVendasFiado] = useState<vendaFiadoProps[]>(
    []
  );

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  const pagaVendaFiado = async () => {
    if (tipoPagamento === "") {
      alertarMensagemSistema(
        "warning",
        "Precisa selecionar o tipo de pagamento!"
      );
    } else if (tokenVenda === "") {
      alertarMensagemSistema(
        "warning",
        "Venda não encontrada, entre em contato com o desenvolvedor!"
      );
    } else {
      processarPagamentoVendaFiado(true);

      const status = await processaPagamentoVendaFiado(
        tokenVenda,
        tipoPagamento
      );

      processarPagamentoVendaFiado(false);
      buscaListaVendas();
      selecionarTipoPagamento("");
      alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    }
  };

  async function buscaListaVendas() {
    carregarListaVendas(true);
    setarListaVendasFiado(await listaVendaFiadoAberto());
    carregarListaVendas(false);
  }

  async function buscaItensSacolaVenda(vendaToken: string) {
    carregarListaItensVenda(true);

    setarListaItensSacolaVenda(await listaItensVenda(vendaToken));

    carregarListaItensVenda(false);
  }

  useEffect(() => {
    buscaListaVendas();
  }, []);

  return (
    <>
      {processandoPagamento ? (
        <div className="row mt-3">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      {mensagemAlerta !== null ? (
        <div className="row mt-3">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <TabelaVendasFiadoAberto
        listaVendasFiado={listaVendasFiado}
        carregandoListaItensVenda={carregandoListaItensVenda}
        carregandoListaVendasFiados={carregandoListaVendasFiados}
        processandoPagamento={processandoPagamento}
        buscaItensSacolaVenda={buscaItensSacolaVenda}
        finalizarVendaFiado={setarTokenVenda}
      />
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
                disabled={carregandoListaItensVenda}
                onClick={() => {
                  setarListaItensSacolaVenda([]);
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TabelaItensVenda
                listaItensVenda={listaItensSacolaVenda}
                carregandoListaItens={carregandoListaItensVenda}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="finalizarFiadoVendaModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="finalizarFiadoVendaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="finalizarFiadoVendaModalLabel"
              >
                Processar pagamento fiado
              </h1>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      id="tipoPagamento"
                      value={tipoPagamento}
                      onChange={(event) =>
                        selecionarTipoPagamento(event.target.value)
                      }
                      aria-label="Tipo de pagamento"
                    >
                      <option disabled value={""}>
                        Selecione
                      </option>
                      {tiposPagamentos.map((tipo) => {
                        return <option value={tipo.valor}>{tipo.nome}</option>;
                      })}
                    </select>
                    <label htmlFor="tipoPagamento">Tipo de pagamento</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={pagaVendaFiado}
                data-bs-dismiss="modal"
              >
                Processar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fiado;
