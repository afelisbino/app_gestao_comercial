import { useId } from "react";
import { categoriaProps } from "../../interfaces/interfaceCategoria";

interface selectCategoriaProps {
  nomeSelect: string;
  categoriaEscolhida: string;
  listaCategoria: categoriaProps[];
  carregandoCategorias: boolean;
  selecionarOpcaoCategoria: (cat_id: string) => void;
}

export function OpcaoCategoria({
  nomeSelect,
  categoriaEscolhida,
  carregandoCategorias,
  listaCategoria,
  selecionarOpcaoCategoria,
}: selectCategoriaProps) {
  const idSelectCategoria = useId();

  return (
    <div className="form-floating">
      <select
        disabled={carregandoCategorias}
        className="form-select"
        key={idSelectCategoria}
        name={nomeSelect}
        value={categoriaEscolhida}
        onChange={(event) => {
          selecionarOpcaoCategoria(event.target.value);
        }}
      >
        <option value={""} disabled>
          {!carregandoCategorias ? "Selecione" : "Carregando categorias..."}
        </option>
        {listaCategoria.map((categoria) => {
          return (
            <option value={categoria.cat_id} key={categoria.cat_id}>
              {categoria.cat_nome}
            </option>
          );
        })}
      </select>
      <label htmlFor={idSelectCategoria}>Categorias</label>
    </div>
  );
}
