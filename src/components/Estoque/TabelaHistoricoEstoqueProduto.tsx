import { historicoProdutoEstoqueProps } from "../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { Placeholder } from "../Loaders/Placeholder";

interface tabelaHistoricoProdutoProps {
  listaHistoricoProduto: historicoProdutoEstoqueProps[];
  carregandoListaHistorico: boolean;
}

export function TabelaHistoricoEstoqueProduto({
  listaHistoricoProduto,
  carregandoListaHistorico,
}: tabelaHistoricoProdutoProps) {
  return (
    <div className="table-responsive mt-3" style={{ maxHeight: "20rem" }}>
      <table className="table border rounded">
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Tipo Movimentação</th>
            <th scope="col">Qtd. Antigo</th>
            <th scope="col">Qtd. Movimentado</th>
            <th scope="col">Qtd. Final</th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {carregandoListaHistorico ? (
            <>
              <tr>
                <th scope="row">
                  <Placeholder />
                </th>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Placeholder />
                </th>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <Placeholder />
                </th>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
                <td>
                  <Placeholder />
                </td>
              </tr>
            </>
          ) : listaHistoricoProduto.length === 0 ? (
            <>
              <td colSpan={4} className="text-center p-3">
                Nenhuma movimentação encontrado
              </td>
            </>
          ) : (
            listaHistoricoProduto.map((historico) => {
              return (
                <>
                  <tr>
                    <th scope="row">{historico.hsp_data}</th>
                    <td
                      className={
                        historico.hsp_tipo === "Entrada"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {historico.hsp_tipo}
                    </td>
                    <td>{historico.hsp_antigo}</td>
                    <td>{historico.hsp_movimentado}</td>
                    <td>{historico.hsp_total}</td>
                  </tr>
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
