import { useState } from "react";
import { Placeholder } from "../../Loaders/Placeholder";
import { PlaceholderButton } from "../../Loaders/PlaceholderButton";
import { vendaFiadoProps } from "../../../interfaces/interfaceVenda";
import { CurrencyDollar, ListNumbers } from "phosphor-react";
import { mascaraValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface tabelaFiadoProps {
  listaVendasFiado: vendaFiadoProps[];
  carregandoListaVendasFiados: boolean;
  carregandoListaItensVenda: boolean;
  processandoPagamento: boolean;
  buscaItensSacolaVenda: (vendaId: string) => void;
  finalizarVendaFiado: (vendaId: string) => void;
}

export function TabelaVendasFiadoAberto({listaVendasFiado, carregandoListaItensVenda, carregandoListaVendasFiados, processandoPagamento, buscaItensSacolaVenda, finalizarVendaFiado}: tabelaFiadoProps) {
  const [filtroCliente, setarFiltroCliente] = useState<string>("");

  const listaVendasFiadoFiltro =
    filtroCliente.length === 0
      ? []
      : listaVendasFiado.filter((cliente: vendaFiadoProps) =>
          cliente.ven_cliente
            .toLowerCase()
            .includes(filtroCliente.toLowerCase())
        );

  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              disabled={carregandoListaVendasFiados}
              className="form-control"
              key="filtroClienteFiado"
              placeholder="Filtrar pelo nome do cliente"
              onChange={(event) => {
                setarFiltroCliente(event.target.value);
              }}
            />
            <label htmlFor="filtroClienteFiado">
              Filtrar pelo nome do cliente
            </label>
          </div>
        </div>
      </div>
      <div className="row">
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
                          data-bs-toggle="modal"
                          data-bs-target="#finalizarFiadoVendaModal"
                          onClick={() => finalizarVendaFiado(venda.ven_id)}
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
                          data-bs-toggle="modal"
                          data-bs-target="#finalizarFiadoVendaModal"
                          onClick={() => finalizarVendaFiado(venda.ven_id)}
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
      </div>
    </>
  );
}
