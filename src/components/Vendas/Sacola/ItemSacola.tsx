import { useId } from "react";
import {
  adicionaMascaraValor,
  formataValorMoedaBrasileira,
} from "../../../controllers/NumeroController";

interface itemSacolaVendaProps {
  id: string;
  scl_qtd: number;
  scl_sub_total: number;
  pro_nome: string;
  processandoVenda: boolean;
  excluirItem: (id: string) => void;
}

export function ItemSacola({
  id,
  scl_qtd,
  scl_sub_total,
  pro_nome,
  processandoVenda,
  excluirItem,
}: itemSacolaVendaProps) {
  const idItemSacola = useId();

  return (
    <>
      <li
        key={idItemSacola}
        className="list-group-item d-flex justify-content-between align-items-start py-3"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">
            {pro_nome + " - " + formataValorMoedaBrasileira(scl_sub_total)}
          </div>
          <button
            type="button"
            key={self.crypto.randomUUID()}
            disabled={processandoVenda}
            className="btn btn-danger shadow mt-2"
            onClick={() => excluirItem(id)}
          >
            Excluir
          </button>
        </div>
        <span className="badge bg-success rounded-pill">
          {adicionaMascaraValor(scl_qtd.toString())}
        </span>
      </li>
    </>
  );
}
