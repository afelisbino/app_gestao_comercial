import { Eye, EyeSlash, PlusMinus } from "phosphor-react";

interface itemEstoqueProps {
  pro_id: string;
  pro_nome: string;
  pro_qtd_atual: number;
  pro_qtd_minimo: number;
  pro_disponivel: boolean;
  alterandoStatusProduto: boolean;
  alterandoQuantidadeEstoque: boolean;
  alterarEstoque: (pro_id: string) => void;
  ativarProdutoEstoque: (pro_id: string) => void;
  desativarProdutoEstoque: (pro_id: string) => void;
}

export function ItemEstoque({
  pro_id,
  pro_nome,
  pro_qtd_atual,
  pro_qtd_minimo,
  pro_disponivel,
  alterandoQuantidadeEstoque,
  alterandoStatusProduto,
  alterarEstoque,
  ativarProdutoEstoque,
  desativarProdutoEstoque,
}: itemEstoqueProps) {
  return (
    <div
      key={pro_id}
      className="card shadow border border-0 bg-light bg-gradient mt-3 mb-4"
      style={{ minWidth: "21rem", height: "auto" }}
    >
      <div className="card-header">
        <h5 className="card-title text-center">
          {pro_nome + (!pro_disponivel ? " (Desativado)" : "")}
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="d-flex d-inline-flex justify-content-md-center">
            <div className="col-6">
              <h5 className="text-center">Qtd. Atual</h5>
              <h4 className="text-center fw-bold">{pro_qtd_atual}</h4>
            </div>
            <div className="col-6">
              <h5 className="text-center">Qtd. Mínimo</h5>
              <h4 className="text-center fw-bold">{pro_qtd_minimo}</h4>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="d-grid gap-2 d-inline-flex justify-content-center">
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-secondary btn-lg shadow"
                title="Alterar Quantidade"
                disabled={alterandoQuantidadeEstoque}
                onClick={() => alterarEstoque(pro_id)}
                data-bs-toggle="modal"
                data-bs-target="#alterarQuantidadeEstoqueModal"
              >
                <PlusMinus color="#ffffff" size={32} />
              </button>
            </div>
            {pro_disponivel ? (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-danger btn-lg shadow"
                  title="Desativar produto no estoque"
                  disabled={alterandoStatusProduto}
                  onClick={() => {
                    desativarProdutoEstoque(pro_id);
                  }}
                >
                  <EyeSlash color="#ffffff" size={32} />
                </button>
              </div>
            ) : (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-success btn-lg shadow"
                  disabled={alterandoStatusProduto}
                  onClick={() => {
                    ativarProdutoEstoque(pro_id);
                  }}
                >
                  <Eye color="#ffffff" size={32} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
