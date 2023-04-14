import { Trash } from "phosphor-react";
import { codigoBarrasProps } from "../../interfaces/interfaceCodigoBarrasProduto";
import { Placeholder } from "../Loaders/Placeholder";

interface tabelaCodigoBarrasProps {
  buscandoListaCodigoBarras: boolean;
  processandoRequisicao: boolean;
  listaCodigoBarras: codigoBarrasProps[];
  removerCodigoBarras: (idCodigo: string | null, index: number) => void;
}

export function TabelaCodigoBarras({
  buscandoListaCodigoBarras,
  listaCodigoBarras,
  processandoRequisicao,
  removerCodigoBarras,
}: tabelaCodigoBarrasProps) {
  return (
    <div className="table-responsive">
      <table className="table border rounded">
        <thead>
          <tr>
            <th scope="col">Opções</th>
            <th scope="col">Código de barras</th>
          </tr>
        </thead>
        <tbody>
          {buscandoListaCodigoBarras ? (
            <>
              <tr>
                <th scope="row" className="w-auto">
                  <Placeholder />
                </th>
                <td className="w-75">
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-auto">
                  <Placeholder />
                </th>
                <td className="w-75">
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-auto">
                  <Placeholder />
                </th>
                <td className="w-75">
                  <Placeholder />
                </td>
              </tr>
            </>
          ) : listaCodigoBarras.length === 0 ? (
            <>
              <td colSpan={4} className="text-center p-3">
                Nenhum codigo de barras adicionado!
              </td>
            </>
          ) : (
            listaCodigoBarras.map((codigoBarra, index) => {
              return (
                <>
                  <tr>
                    <th scope="row" className="w-auto">
                      <button
                        key={codigoBarra.pcb_id}
                        type="button"
                        title="Remover código de barras"
                        className="btn-danger btn shadow"
                        disabled={processandoRequisicao}
                        onClick={() => {
                          removerCodigoBarras(
                            codigoBarra.pcb_id ?? null,
                            index
                          );
                        }}
                      >
                        <Trash size={32} color="#ffffff" />
                      </button>
                    </th>
                    <td className="w-100">{codigoBarra.pcb_codigo}</td>
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
