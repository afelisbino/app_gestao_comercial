import { useState } from "react";
import { formataValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface listaProdutoProps {
  pro_id: string;
  pro_nome: string;
  pro_valor: number;
  pro_qtd_atual_estoque: number;
  processandoVenda: boolean;
  adicionarProduto: (
    qtdAtualEstoque: number,
    idProduto: string,
    nomeProduto: string,
    valorProduto: number
  ) => void;
}

export function Produtos({
  pro_id,
  pro_nome,
  pro_valor,
  pro_qtd_atual_estoque,
  processandoVenda,
  adicionarProduto,
}: listaProdutoProps) {
  return (
    <div
      key={pro_id}
      className="card shadow border-0 bg-secondary bg-gradient text-bg-dark"
      style={{ width: "18rem", height: "auto" }}
    >
      <div className="card-body" style={{ height: "10em" }}>
        <h5 className="card-title text-center text-wrap user-select-none mb-3">
          {pro_nome}
        </h5>
        <hr />
        <h6 className="card-subtitle mb-4  text-center user-select-none">
          {formataValorMoedaBrasileira(Number(pro_valor))}
        </h6>
      </div>
      <div className="card-footer">
        <div className="d-grid gap-2">
          <button
            type="button"
            key={"button-add-" + pro_id}
            className="btn btn-success btn-lg shadow"
            disabled={processandoVenda}
            onClick={() => {
              adicionarProduto(
                pro_qtd_atual_estoque,
                pro_id,
                pro_nome,
                pro_valor
              );
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
