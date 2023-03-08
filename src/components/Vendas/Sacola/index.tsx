import { useId } from "react";
import { mascaraValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface sacolaVendaProps {
  index: number;
  scl_qtd: number;
  scl_sub_total: number;
  pro_nome: string;
  processandoVenda: boolean;
  excluirItem: (index: number) => void;
  descontarValor: (valorItem: number) => void;
}

export function Sacola({
  index,
  scl_qtd,
  scl_sub_total,
  pro_nome,
  processandoVenda,
  excluirItem,
  descontarValor,
}: sacolaVendaProps) {
  function removerItemCarrinho(index: number, valorItem: number) {
    excluirItem(index);

    descontarValor(valorItem);
  }

  const itemSacola: string = useId();

  return (
    <>
      <li
        key={itemSacola}
        className="list-group-item d-flex justify-content-between align-items-start py-3"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">
            {pro_nome + " - " + mascaraValorMoedaBrasileira(scl_sub_total)}
          </div>
          <button
            type="button"
            id={"btn-deleta-item-" + itemSacola}
            disabled={processandoVenda}
            className="btn btn-danger shadow mt-2"
            onClick={() => removerItemCarrinho(index, scl_sub_total)}
          >
            Excluir
          </button>
        </div>
        <span className="badge bg-success rounded-pill">{scl_qtd}</span>
      </li>
    </>
  );
}
