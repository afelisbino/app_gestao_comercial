import { ListNumbers } from "phosphor-react";
import { vendasFinalizadaProps } from "../../interfaces/interfaceRelatorioVendas";
import { Placeholder } from "../Loaders/Placeholder";
import { PlaceholderButton } from "../Loaders/PlaceholderButton";
import { mascaraValorMoedaBrasileira } from "../../controllers/NumeroController";

interface tabelaVendasFinalizadasProps {
  listaVendas: vendasFinalizadaProps[];
  buscandoLista: boolean;
  buscandoItensVenda: boolean;
  visualizarItensVenda: (ven_id: string) => void;
}

export function TabelaVendasFinalizado({
  listaVendas,
  buscandoLista,
  buscandoItensVenda,
  visualizarItensVenda,
}: tabelaVendasFinalizadasProps) {
  return (
    <div className="table-responsive mt-3" style={{ maxHeight: "18rem" }}>
      <table className="table border rounded mb-5">
        <caption>Lista vendas finalizadas</caption>
        <thead>
          <tr>
            <th scope="col">Opções</th>
            <th scope="col">Data/Hora</th>
            <th scope="col">Tipo</th>
            <th scope="col">Forma de pagamento</th>
            <th scope="col">Valor compra</th>
            <th scope="col">Desconto compra</th>
            <th scope="col">Valor pago</th>
            <th scope="col">Ganhos</th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {buscandoLista ? (
            <>
              <tr>
                <th className="w-auto" scope="row">
                  <PlaceholderButton />
                </th>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
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
                </th>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
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
                </th>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
                  <Placeholder />
                </td>
                <td className="w-auto">
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
          ) : listaVendas.length === 0 ? (
            <td colSpan={8} className="text-center p-3">
              Nenhum venda em aberta encontrada
            </td>
          ) : (
            listaVendas.map((venda) => {
              return (
                <tr>
                  <th className="w-auto" scope="row">
                    <button
                      title="Visualizar itens da compra"
                      type="button"
                      key={"btn-visualizar-itens-" + venda.ven_id}
                      className="btn btn-info shadow m-1"
                      disabled={buscandoItensVenda}
                      onClick={() => visualizarItensVenda(venda.ven_id)}
                      data-bs-toggle="modal"
                      data-bs-target="#itensCompradoVendaModal"
                    >
                      <ListNumbers size={32} color="#ffffff" />
                    </button>
                  </th>
                  <td className="w-auto">{venda.ven_data}</td>
                  <td className="w-auto">{venda.ven_tipo}</td>
                  <td className="w-auto">
                    {mascaraValorMoedaBrasileira(
                      Number(venda.ven_valor_compra)
                    )}
                  </td>
                  <td className="w-auto">{venda.ven_pagamento}</td>
                  <td className="w-auto">
                    {mascaraValorMoedaBrasileira(Number(venda.ven_desconto))}
                  </td>
                  <td className="w-auto">
                    {mascaraValorMoedaBrasileira(Number(venda.ven_total))}
                  </td>
                  <td
                    className={
                      "w-auto fw-bold " +
                      (venda.ven_lucro < 0 ? "text-danger" : "text-success")
                    }
                  >
                    {mascaraValorMoedaBrasileira(Number(venda.ven_lucro))}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
