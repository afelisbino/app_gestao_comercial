import { historicoEstoqueEmpresaProps } from "../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { Placeholder } from "../Loaders/Placeholder";

interface tabelaHistoricoEstoqueProps {
  listaHistoricoEstoque: historicoEstoqueEmpresaProps[];
  carregandoListaHistorico: boolean;
}

export function TabelaHistoricoEstoque({
  listaHistoricoEstoque,
  carregandoListaHistorico,
}: tabelaHistoricoEstoqueProps) {
  return (
    <div className="table-responsive mt-3" style={{ maxHeight: "25rem" }}>
      <table className="table border rounded">
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Tipo Movimentação</th>
            <th scope="col">Produto</th>
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
                <td>
                  <Placeholder />
                </td>
              </tr>
            </>
          ) : listaHistoricoEstoque.length === 0 ? (
            <>
              <td colSpan={6} className="text-center p-3">
                Nenhuma movimentação encontrado
              </td>
            </>
          ) : (
            listaHistoricoEstoque.map((historico) => {
              return (
                <>
                  <tr>
                    <th className="col-auto " scope="row">
                      {historico.hsp_data}
                    </th>
                    <td
                      className={
                        "fw-bold col-auto " +
                        (historico.hsp_tipo === "Entrada"
                          ? "text-success"
                          : "text-danger")
                      }
                    >
                      {historico.hsp_tipo}
                    </td>
                    <td className="col-auto ">{historico.pro_nome}</td>
                    <td className="text-warning fw-bold">
                      {historico.hsp_antigo}
                    </td>
                    <td
                      className={
                        "fw-bold col-auto " +
                        (historico.hsp_tipo === "Entrada"
                          ? "text-success"
                          : "text-danger")
                      }
                    >
                      {historico.hsp_movimentado}
                    </td>
                    <td className="fw-bold col-auto text-primary">
                      {historico.hsp_total}
                    </td>
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
