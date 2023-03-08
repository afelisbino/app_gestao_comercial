import { useState } from "react";
import { sacolaProp } from "../../../interfaces/interfaceSacola";
import { mascaraValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface listaProdutoProps {
  pro_id: string;
  pro_nome: string;
  pro_valor: number;
  processandoVenda: boolean;
  adicionarProduto: (item: sacolaProp) => void;
}

export function Produtos({
  pro_id,
  pro_nome,
  pro_valor,
  processandoVenda,
  adicionarProduto,
}: listaProdutoProps) {
  
  const [qtdItem, adicionaQuatidade] = useState<number>(1);

  return (
    <div
      key={pro_id}
      className="card shadow border border-0 bg-light bg-gradient"
      style={{ minWidth: "21rem", height: "auto" }}
    >
      <div className="card-body">
        <h5 className="card-title text-center">{pro_nome}</h5>
        <h6 className="card-subtitle mb-4 text-muted text-center">
          {mascaraValorMoedaBrasileira(Number(pro_valor))}
        </h6>
        <div className="row">
          <div className="col-12 align-middle">
            <div className="form-floating">
              <input
                type="number"
                name="spr_qtd"
                className="form-control"
                disabled={processandoVenda}
                value={qtdItem}
                onChange={(event) =>
                  adicionaQuatidade(parseInt(event.target.value))
                }
              />
              <label htmlFor="spr_qtd">Quantidade</label>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-success btn-lg shadow"
            disabled={processandoVenda}
            onClick={() => {
              adicionarProduto({
                pro_id: pro_id,
                pro_nome: pro_nome,
                scl_qtd: qtdItem,
                scl_sub_total: pro_valor * qtdItem,
              });

              adicionaQuatidade(1);
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
