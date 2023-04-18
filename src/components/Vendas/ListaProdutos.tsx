import { produtoAtivosProps } from "../../interfaces/interfaceProdutosAtivos";
import { Produtos } from "../ItensVenda/Produtos";
import { ProdutosPlaceholder } from "../Loaders/ProdutosPlaceholder";

interface listaProdutosProps {
  carregandoProdutos: boolean;
  processandoVenda: boolean;
  listaProdutos: produtoAtivosProps[];
  adicionarItemSacola: (
    qtdAtualEstoque: number,
    idProduto: string,
    nomeProduto: string,
    valorProduto: number
  ) => void;
}

export function ListaProdutos({
  carregandoProdutos,
  processandoVenda,
  listaProdutos,
  adicionarItemSacola,
}: listaProdutosProps) {
  return (
    <>
      {!carregandoProdutos ? (
        <div
          className="d-flex justify-content-lg-center justify-content-start flex-wrap overflow-auto gap-2"
          style={{ maxHeight: "80vh", width: "auto" }}
        >
          {listaProdutos.length > 0 ? (
            listaProdutos.map((produto) => {
              return (
                <>
                  <Produtos
                    processandoVenda={processandoVenda}
                    pro_id={produto.pro_id}
                    pro_nome={produto.pro_nome}
                    pro_qtd_atual_estoque={produto.est_qtd_atual}
                    pro_valor={produto.pro_valor}
                    adicionarProduto={adicionarItemSacola}
                  />
                </>
              );
            })
          ) : (
            <span className="h4 fw-semibold">
              {"Nenhum produto encontrado!"}
            </span>
          )}
        </div>
      ) : (
        <div className="d-flex justify-content-center flex-wrap gap-2">
          <div className="col-auto ">
            <ProdutosPlaceholder />
          </div>
          <div className="col-auto ">
            <ProdutosPlaceholder />
          </div>
          <div className="col-auto ">
            <ProdutosPlaceholder />
          </div>
        </div>
      )}
    </>
  );
}
