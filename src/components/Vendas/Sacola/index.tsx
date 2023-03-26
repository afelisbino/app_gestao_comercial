
import { mascaraValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface sacolaVendaProps {
  id: string;
  scl_qtd: number;
  scl_sub_total: number;
  pro_nome: string;
  processandoVenda: boolean;
  excluirItem: (id: string) => void;
}

export function Sacola({
  id,
  scl_qtd,
  scl_sub_total,
  pro_nome,
  processandoVenda,
  excluirItem,
}: sacolaVendaProps) {
  return (
    <>
      <li
        key={id}
        className="list-group-item d-flex justify-content-between align-items-start py-3"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">
            {pro_nome + " - " + mascaraValorMoedaBrasileira(scl_sub_total)}
          </div>
          <button
            type="button"
            id={"btn-deleta-item-" + id}
            disabled={processandoVenda}
            className="btn btn-danger shadow mt-2"
            onClick={() => excluirItem(id)}
          >
            Excluir
          </button>
        </div>
        <span className="badge bg-success rounded-pill">{scl_qtd}</span>
      </li>
    </>
  );
}
