import { Pencil, TrashSimple } from "phosphor-react";
import { fornecedorProps } from "../../interfaces/interfaceFornecedor";
import { Placeholder } from "../Loaders/Placeholder";
import { PlaceholderButton } from "../Loaders/PlaceholderButton";

interface tabelaProps {
  editar: (id: string) => void;
  listaFornecedores: fornecedorProps[];
  carregandoLista: boolean;
  processandoRequisicao: boolean;
}

export function TabelaFornecedor({
  listaFornecedores,
  carregandoLista,
  processandoRequisicao,
  editar,
}: tabelaProps) {
  return (
    <div className="table-responsive mt-3 tabela-tela">
      <table className="table border rounded">
        <caption>Lista de Fornecedores</caption>
        <thead>
          <tr>
            <th scope="col">Opções</th>
            <th scope="col">Nome</th>
            <th scope="col">Documento</th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {carregandoLista ? (
            <>
              <tr key={self.crypto.randomUUID()}>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-50">
                  <Placeholder />
                </td>
                <td className="w-50">
                  <Placeholder />
                </td>
              </tr>
              <tr key={self.crypto.randomUUID()}>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-50">
                  <Placeholder />
                </td>
                <td className="w-50">
                  <Placeholder />
                </td>
              </tr>
              <tr key={self.crypto.randomUUID()}>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-50">
                  <Placeholder />
                </td>
                <td className="w-50">
                  <Placeholder />
                </td>
              </tr>
            </>
          ) : listaFornecedores.length === 0 ? (
            <>
              <td colSpan={4} className="text-center p-3">
                Nenhum fornecedor encontrado
              </td>
            </>
          ) : (
            listaFornecedores.map((fornecedor) => {
              return (
                <>
                  <tr>
                    <th scope="row" className="w-auto">
                      <button
                        type="button"
                        title="Editar Fornecedor"
                        className="btn btn-warning shadow m-1"
                        disabled={processandoRequisicao}
                        onClick={() => {
                          editar(fornecedor.frn_id);
                        }}
                      >
                        <Pencil size={32} color="#ffffff" />
                      </button>
                    </th>
                    <td className="w-50">{fornecedor.frn_nome}</td>
                    <td className="w-50">{fornecedor.frn_doc ?? "--"}</td>
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
