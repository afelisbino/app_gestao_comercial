
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

  return (
    <div className="form-floating">
      <select
        disabled={carregandoCategorias}
        className="form-select"
        key={nomeSelect}
        name={nomeSelect}
        value={categoriaEscolhida}
        onChange={(event) => {
          selecionarOpcaoCategoria(event.target.value);
        }}
      >
        <option value={""} selected disabled>
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
      <label htmlFor={nomeSelect}>Categorias</label>
    </div>
  );
}
