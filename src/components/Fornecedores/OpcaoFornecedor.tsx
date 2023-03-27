import { useId } from "react";
import { fornecedorProps } from "../../interfaces/interfaceFornecedor";

interface opcaoFornecedorProps {
  nomeSelect: string;
  fornecedorSelecionado: string;
  carregandoFornecedores: boolean;
  listaFornecedor: fornecedorProps[];
  selecionarOpcaoFornecedor: (frn_id: string) => void;
}

export function OpcaoFornecedor({
  nomeSelect,
  fornecedorSelecionado,
  carregandoFornecedores,
  listaFornecedor,
  selecionarOpcaoFornecedor,
}: opcaoFornecedorProps) {
  const idSelectFornecedor = useId();

  return (
    <div className="form-floating">
      <select
        disabled={carregandoFornecedores}
        className="form-select"
        key={idSelectFornecedor}
        name={nomeSelect}
        value={fornecedorSelecionado}
        onChange={(event) => {
          selecionarOpcaoFornecedor(event.target.value);
        }}
      >
        <option value={""} disabled>
          {!carregandoFornecedores ? "Selecione" : "Carregando fornecedores..."}
        </option>
        {listaFornecedor.map((fornecedor) => {
          return (
            <option value={fornecedor.frn_id} key={fornecedor.frn_id}>
              {fornecedor.frn_nome}
            </option>
          );
        })}
      </select>
      <label htmlFor={idSelectFornecedor}>Fornecedores</label>
    </div>
  );
}
