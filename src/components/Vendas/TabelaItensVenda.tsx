import React from "react";
import { itensVendaProps } from "../../interfaces/interfaceVenda";
import { Placeholder } from "../Loaders/Placeholder";
import { mascaraValorMoedaBrasileira } from "../../controllers/NumeroController";

interface tabelaItensProps {
  listaItensVenda: itensVendaProps[];
  carregandoListaItens: boolean;
}

export function TabelaItensVenda({
  listaItensVenda,
  carregandoListaItens,
}: tabelaItensProps) {
  return (
    <div className="table-responsive mt-3" style={{ maxHeight: "20rem" }}>
      <table className="table border rounded">
        <thead>
          <tr>
            <th scope="col">Produto</th>
            <th scope="col">Valor do produto</th>
            <th scope="col">Qtd. Comprado</th>
            <th scope="col">Total do Item</th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {carregandoListaItens ? (
            <>
              <tr>
                <th scope="row" className="w-25">
                  <Placeholder />
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
              </tr>
              <tr>
                <th scope="row" className="w-25">
                  <Placeholder />
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
              </tr>
              <tr>
                <th scope="row" className="w-25">
                  <Placeholder />
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
              </tr>
            </>
          ) : listaItensVenda.length === 0 ? (
            <>
              <td colSpan={4} className="text-center p-3">
                Nenhum item comprado nessa venda
              </td>
            </>
          ) : (
            listaItensVenda.map((item) => {
              return (
                <tr key={item.scl_id}>
                  <td scope="row" className="w-25">
                    {item.pro_nome}
                  </td>
                  <td className="w-auto">
                    {mascaraValorMoedaBrasileira(Number(item.pro_valor))}
                  </td>
                  <td className="w-auto">{item.scl_qtd}</td>
                  <td className="w-auto">
                    {mascaraValorMoedaBrasileira(Number(item.scl_sub_total))}
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
