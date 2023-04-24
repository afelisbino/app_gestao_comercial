import { estoqueProps } from "../../interfaces/interfaceEstoque";
import { PlaceholderCardItemEstoque } from "../Loaders/PlaceholderCardItemEstoque";
import { ItemEstoque } from "./ItemEstoque";

interface listaEstoqueProps {
  carregandoLista: boolean;
  alterandoQuantidadeEstoque: boolean;
  alterandoStatusProduto: boolean;
  listaProdutos: estoqueProps[];
  alterarQuantidade: (produtoId: string) => void;
  ativarProdutoEstoque: (produtoId: string) => void;
  desativarProdutoEstoque: (produtoId: string) => void;
}

export function ListaEstoque({
  carregandoLista,
  alterandoQuantidadeEstoque,
  alterandoStatusProduto,
  listaProdutos,
  alterarQuantidade,
  ativarProdutoEstoque,
  desativarProdutoEstoque,
}: listaEstoqueProps) {
  return (
    <div
      className="d-flex flex-row flex-wrap justify-content-center lista-pordutos-estoque overflow-auto gap-2 pt-3"
    >
      {carregandoLista ? (
        <>
          <div className="col-auto mx-auto">
            <PlaceholderCardItemEstoque />
          </div>
          <div className="col-auto mx-auto">
            <PlaceholderCardItemEstoque />
          </div>
          <div className="col-auto mx-auto">
            <PlaceholderCardItemEstoque />
          </div>
        </>
      ) : (
        listaProdutos.map((produto) => {
          return (
            <>
              <div className="col-auto mx-auto">
                <ItemEstoque
                  pro_id={produto.pro_id}
                  pro_nome={produto.pro_nome}
                  pro_qtd_atual={produto.pro_qtd_atual}
                  pro_qtd_minimo={produto.pro_qtd_minimo}
                  pro_disponivel={produto.pro_disponivel}
                  alterarEstoque={alterarQuantidade}
                  alterandoQuantidadeEstoque={alterandoQuantidadeEstoque}
                  alterandoStatusProduto={alterandoStatusProduto}
                  ativarProdutoEstoque={ativarProdutoEstoque}
                  desativarProdutoEstoque={desativarProdutoEstoque}
                />
              </div>
            </>
          );
        })
      )}
    </div>
  );
}
