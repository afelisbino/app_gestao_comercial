import React, { useEffect, useState } from "react";
import { Placeholder } from "../../Loaders/Placeholder";
import { PlaceholderButton } from "../../Loaders/PlaceholderButton";
import {
  itensVendaProps,
  vendaFiadoProps,
} from "../../../interfaces/interfaceVenda";
import {
  listaVendaFiadoAberto,
  processaPagamentoVendaFiado,
} from "../../../controllers/VendaController";
import { CurrencyDollar, ListNumbers } from "phosphor-react";
import { mascaraValorMoedaBrasileira } from "../../../controllers/NumeroController";
import { TabelaItensVenda } from "../TabelaItensVenda";
import { listaItensVenda } from "../../../controllers/VendaController";
import { Spinner } from "../../Loaders/Spinner";
import { Alerta } from "../../Alerta";

export function Listar() {
  const [carregandoListaVendasFiados, carregarListaVendas] = useState(false);
  const [carregandoListaItensVenda, carregarListaItensVenda] = useState(false);
  const [processandoPagamento, processarPagamentoVendaFiado] = useState(false);

  const [listaItensSacolaVenda, setarListaItensSacolaVenda] = useState<
    itensVendaProps[]
  >([]);
  const [listaVendasFiado, setarListaVendasFiado] = useState<vendaFiadoProps[]>(
    []
  );

  const [listaVendasFiadoFiltro, setarListaVendasFiadoFiltro] = useState<
    vendaFiadoProps[]
  >([]);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

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

  async function pagaVendaFiado(tokenVenda: string) {
    processarPagamentoVendaFiado(true);

    const processa = await processaPagamentoVendaFiado(tokenVenda);

    processarPagamentoVendaFiado(false);

    if (processa.status) {
      buscaListaVendas();
      alertarMensagemSistema("success", processa.msg);
    } else {
      alertarMensagemSistema("warning", processa.msg);
    }
  }

  function filtraVendaCliente(nomeCliente: string) {
    if (nomeCliente.length > 0) {
      setarListaVendasFiadoFiltro(
        listaVendasFiado.filter((nome: vendaFiadoProps) =>
          nome["ven_cliente"].toLowerCase().includes(nomeCliente.toLowerCase())
        )
      );
    } else {
      setarListaVendasFiadoFiltro([]);
    }
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  useEffect(() => {
    buscaListaVendas();
  }, []);

  return (
    <>
      {processandoPagamento ? (
        <div className="row mt-5">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      {mensagemAlerta !== null ? (
        <div className="row mt-5">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="row mt-5">
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              disabled={carregandoListaVendasFiados}
              className="form-control"
              key="filtroClienteFiado"
              placeholder="Filtrar pelo nome do cliente"
              onChange={(event) => {
                filtraVendaCliente(event.target.value);
              }}
            />
            <label htmlFor="filtroClienteFiado">
              Filtrar pelo nome do cliente
            </label>
          </div>
        </div>
      </div>
      <div className="table-responsive mt-3" style={{ maxHeight: "35rem" }}>
        <table className="table border rounded">
          <caption>Lista de vendas em abertos</caption>
          <thead>
            <tr>
              <th scope="col">Opções</th>
              <th scope="col">Nome do cliente</th>
              <th scope="col">Data da compra</th>
              <th scope="col">Valor da compra</th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {carregandoListaVendasFiados ? (
              <>
                <tr>
                  <th className="w-auto" scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td className="w-50">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                </tr>
                <tr>
                  <th className="w-auto" scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td className="w-50">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                </tr>
                <tr>
                  <th className="w-auto" scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td className="w-50">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                  <td className="w-auto">
                    <Placeholder />
                  </td>
                </tr>
              </>
            ) : listaVendasFiado.length === 0 ? (
              <td colSpan={4} className="text-center p-3">
                Nenhum venda em aberta encontrada
              </td>
            ) : listaVendasFiadoFiltro.length > 0 ? (
              listaVendasFiadoFiltro.map((venda) => {
                return (
                  <tr>
                    <th className="w-auto" scope="row">
                      <button
                        title="Pagar dívida"
                        type="button"
                        key={"btn-pagar-" + venda.ven_id}
                        disabled={
                          carregandoListaItensVenda || processandoPagamento
                        }
                        className="btn btn-success shadow m-1"
                        onClick={() => pagaVendaFiado(venda.ven_id)}
                      >
                        <CurrencyDollar size={32} color="#ffffff" />
                      </button>
                      <button
                        title="Visualizar itens da compra"
                        type="button"
                        key={"btn-visualizar-itens-" + venda.ven_id}
                        className="btn btn-info shadow m-1"
                        onClick={() => buscaItensSacolaVenda(venda.ven_id)}
                        data-bs-toggle="modal"
                        data-bs-target="#itensCompradoVendaModal"
                      >
                        <ListNumbers size={32} color="#ffffff" />
                      </button>
                    </th>
                    <td className="w-50">{venda.ven_cliente}</td>
                    <td className="w-auto">{venda.ven_data}</td>
                    <td className="w-auto">
                      {mascaraValorMoedaBrasileira(Number(venda.ven_total))}
                    </td>
                  </tr>
                );
              })
            ) : (
              listaVendasFiado.map((venda) => {
                return (
                  <tr>
                    <th className="w-auto" scope="row">
                      <button
                        title="Pagar dívida"
                        type="button"
                        key={"btn-pagar-" + venda.ven_id}
                        disabled={
                          carregandoListaItensVenda || processandoPagamento
                        }
                        className="btn btn-success shadow m-1"
                        onClick={() => pagaVendaFiado(venda.ven_id)}
                      >
                        <CurrencyDollar size={32} color="#ffffff" />
                      </button>
                      <button
                        title="Visualizar itens da compra"
                        type="button"
                        key={"btn-visualizar-itens-" + venda.ven_id}
                        className="btn btn-info shadow m-1"
                        disabled={carregandoListaItensVenda}
                        onClick={() => buscaItensSacolaVenda(venda.ven_id)}
                        data-bs-toggle="modal"
                        data-bs-target="#itensCompradoVendaModal"
                      >
                        <ListNumbers size={32} color="#ffffff" />
                      </button>
                    </th>
                    <td className="w-50">{venda.ven_cliente}</td>
                    <td className="w-auto">{venda.ven_data}</td>
                    <td className="w-auto">
                      {mascaraValorMoedaBrasileira(Number(venda.ven_total))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
    </>
  );
}
