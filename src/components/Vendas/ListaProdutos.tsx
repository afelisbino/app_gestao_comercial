import { produtoAtivosProps } from "../../interfaces/interfaceProdutosAtivos";
import { ProdutosPlaceholder } from "../Loaders/ProdutosPlaceholder";
import { ItemProduto } from "./ItemProduto";

import imgProdutoNaoEncontrado from "../../assets/images/not-found.svg";

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
  return carregandoProdutos ? (
    <div className="d-flex flex-sm-row flex-lg-wrap justify-content-lg-center justify-content-start overflow-auto gap-3 lista-produtos">
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
  ) : listaProdutos.length > 0 ? (
    <div className="d-flex flex-sm-row flex-lg-wrap justify-content-lg-center justify-content-start overflow-auto gap-3 lista-produtos">
      {listaProdutos.map((produto) => {
        return (
          <div className="col-auto">
            <ItemProduto
              processandoVenda={processandoVenda}
              pro_id={produto.pro_id}
              pro_nome={produto.pro_nome}
              pro_qtd_atual_estoque={produto.est_qtd_atual}
              pro_valor={produto.pro_valor}
              adicionarProduto={adicionarItemSacola}
            />
          </div>
        );
      })}
    </div>
  ) : (
    <div className="d-flex flex-column gap-3 p-3">
      <div className="row border rounded mx-auto py-3">
        <strong className="h4 text-center">
          {"Nenhum produto encontrado!"}
        </strong>
      </div>
      <div className="d-flex justify-content-center">
        <img
          src={imgProdutoNaoEncontrado}
          alt="Nenhuma produto encontrado"
          className="img-thumbnail border-0 imagem-vazio"
        />
      </div>
    </div>
  );
}
