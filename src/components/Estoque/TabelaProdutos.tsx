import {
  Barcode,
  ClockCounterClockwise,
  Eye,
  EyeSlash,
  Pencil,
} from "phosphor-react";
import { produtoProps } from "../../interfaces/interfaceProdutos";
import { Placeholder } from "../Loaders/Placeholder";
import { useState } from "react";
import { mascaraValorMoedaBrasileira } from "../../controllers/NumeroController";
import { PlaceholderButton } from "../Loaders/PlaceholderButton";

interface tabelaProdutoProps {
  listaProdutos: produtoProps[];
  carregandoListaProdutos: boolean;
  processandoRequisicao: boolean;
  editarProduto: (
    idProduto: string,
    nomeProduto: string,
    descricaoProduto: string | null,
    precoProduto: number,
    valorCompra: number,
    tokenCategoria: string,
    tokenFornecedor: string,
    estoqueAtual: number,
    estoqueMinimo: number
  ) => void;
  desativarProduto: (idProduto: string) => void;
  ativarProduto: (idProduto: string) => void;
  visualizarCodigosBarrasProduto: (idProduto: string) => void;
  visualizarHistoricoEstoqueProduto: (idProduto: string) => void;
}

export function TabelaProdutos({
  listaProdutos,
  carregandoListaProdutos,
  processandoRequisicao,
  editarProduto,
  desativarProduto,
  ativarProduto,
  visualizarCodigosBarrasProduto,
  visualizarHistoricoEstoqueProduto,
}: tabelaProdutoProps) {
  const [listaFiltroProdutos, setarListaFiltroProduto] = useState<
    produtoProps[]
  >([]);

  function filtraProdutoNome(filtro: string) {
    if (filtro.length !== 0) {
      setarListaFiltroProduto(
        listaProdutos.filter((el: produtoProps) =>
          el["pro_nome"].toLowerCase().includes(filtro.toLowerCase())
        )
      );
    } else {
      setarListaFiltroProduto([]);
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-12 mt-2">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="pro_nome_filtro"
              placeholder="Produto"
              disabled={carregandoListaProdutos}
              onChange={(event) => filtraProdutoNome(event.target.value)}
            />
            <label htmlFor="pro_nome_filtro">Pesquisar nome do produto</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive" style={{ maxHeight: "20rem" }}>
          <table className="table border rounded">
            <caption>Lista de produtos</caption>
            <thead>
              <tr>
                <th scope="col">Opções</th>
                <th scope="col">Nome</th>
                <th scope="col">Preço</th>
                <th scope="col">Estoque Atual</th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {carregandoListaProdutos ? (
                <>
                  <tr>
                    <th className="w-auto" scope="row">
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                    </th>
                    <td className="w-50">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                  </tr>
                  <tr>
                    <th className="w-auto" scope="row">
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                    </th>
                    <td className="w-50">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                  </tr>
                  <tr>
                    <th className="w-auto" scope="row">
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                      <PlaceholderButton />
                    </th>
                    <td className="w-50">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                    <td className="w-auto">
                      <Placeholder />
                    </td>
                  </tr>
                </>
              ) : listaProdutos.length === 0 ? (
                <>
                  <td colSpan={4} className="text-center p-3">
                    Nenhum produto encontrado
                  </td>
                </>
              ) : listaFiltroProdutos.length === 0 ? (
                listaProdutos.map((produto) => {
                  return (
                    <>
                      <tr>
                        <th className="w-auto" scope="row">
                          <button
                            type="button"
                            title="Editar produto"
                            key={produto.pro_id + "-edita_produto"}
                            className="btn btn-warning shadow m-1"
                            disabled={processandoRequisicao}
                            onClick={() =>
                              editarProduto(
                                produto.pro_id,
                                produto.pro_nome,
                                produto.pro_descricao,
                                produto.pro_valor_venda,
                                produto.pro_preco_custo,
                                produto.cat_token,
                                produto.frn_token,
                                produto.est_qtd_atual,
                                produto.est_qtd_minimo
                              )
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#produtoEdicaoModal"
                          >
                            <Pencil size={32} color="#ffffff" />
                          </button>
                          {produto.pro_disponivel ? (
                            <button
                              type="button"
                              key={produto.pro_id + "-desativa_produto"}
                              title="Desativar produto"
                              onClick={() => desativarProduto(produto.pro_id)}
                              className="btn btn-danger shadow"
                              disabled={processandoRequisicao}
                            >
                              <EyeSlash size={32} color="#ffffff" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              key={produto.pro_id + "-ativa_produto"}
                              title="Ativar produto"
                              onClick={() => ativarProduto(produto.pro_id)}
                              className="btn btn-success shadow"
                              disabled={processandoRequisicao}
                            >
                              <Eye size={32} color="#ffffff" />
                            </button>
                          )}
                          <button
                            type="button"
                            key={produto.pro_id + "-codigo_barra_produto"}
                            title="Gerenciar codigos de barras do produto"
                            className="btn btn-secondary shadow m-1"
                            disabled={processandoRequisicao}
                            onClick={() =>
                              visualizarCodigosBarrasProduto(produto.pro_id)
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#codigoBarrasProdutoEdicaoModal"
                          >
                            <Barcode size={32} color="#ffffff" />
                          </button>
                          <button
                            type="button"
                            key={produto.pro_id + "-historico_produto"}
                            title="Historico de estoque do produto"
                            className="btn btn-info shadow"
                            onClick={() =>
                              visualizarHistoricoEstoqueProduto(produto.pro_id)
                            }
                            disabled={processandoRequisicao}
                            data-bs-toggle="modal"
                            data-bs-target="#historicoProdutoModal"
                          >
                            <ClockCounterClockwise size={32} color="#ffffff" />
                          </button>
                        </th>
                        <td className="w-50">{produto.pro_nome}</td>
                        <td className="w-auto">
                          {mascaraValorMoedaBrasileira(
                            Number(produto.pro_valor_venda)
                          )}
                        </td>
                        <td className="w-auto">{produto.est_qtd_atual}</td>
                      </tr>
                    </>
                  );
                })
              ) : (
                listaFiltroProdutos.map((produto) => {
                  return (
                    <>
                      <tr>
                        <th className="w-auto" scope="row">
                          <button
                            type="button"
                            title="Editar produto"
                            key={produto.pro_id + "-edita_produto"}
                            className="btn btn-warning shadow m-1"
                            disabled={processandoRequisicao}
                            onClick={() =>
                              editarProduto(
                                produto.pro_id,
                                produto.pro_nome,
                                produto.pro_descricao,
                                produto.pro_valor_venda,
                                produto.pro_preco_custo,
                                produto.cat_token,
                                produto.frn_token,
                                produto.est_qtd_atual,
                                produto.est_qtd_minimo
                              )
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#produtoEdicaoModal"
                          >
                            <Pencil size={32} color="#ffffff" />
                          </button>
                          {produto.pro_disponivel ? (
                            <button
                              type="button"
                              key={produto.pro_id + "-desativa_produto"}
                              title="Desativar produto"
                              onClick={() => desativarProduto(produto.pro_id)}
                              className="btn btn-danger shadow"
                              disabled={processandoRequisicao}
                            >
                              <EyeSlash size={32} color="#ffffff" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              key={produto.pro_id + "-ativa_produto"}
                              title="Ativar produto"
                              onClick={() => ativarProduto(produto.pro_id)}
                              className="btn btn-success shadow"
                              disabled={processandoRequisicao}
                            >
                              <Eye size={32} color="#ffffff" />
                            </button>
                          )}
                          <button
                            type="button"
                            key={produto.pro_id + "-codigo_barra_produto"}
                            title="Gerenciar codigos de barras do produto"
                            className="btn btn-secondary shadow m-1"
                            disabled={processandoRequisicao}
                            onClick={() =>
                              visualizarCodigosBarrasProduto(produto.pro_id)
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#codigoBarrasProdutoEdicaoModal"
                          >
                            <Barcode size={32} color="#ffffff" />
                          </button>
                          <button
                            type="button"
                            key={produto.pro_id + "-historico_produto"}
                            title="Historico de estoque do produto"
                            className="btn btn-info shadow"
                            onClick={() =>
                              visualizarHistoricoEstoqueProduto(produto.pro_id)
                            }
                            disabled={processandoRequisicao}
                            data-bs-toggle="modal"
                            data-bs-target="#historicoProdutoModal"
                          >
                            <ClockCounterClockwise size={32} color="#ffffff" />
                          </button>
                        </th>
                        <td className="w-50">{produto.pro_nome}</td>
                        <td className="w-auto">
                          {mascaraValorMoedaBrasileira(
                            Number(produto.pro_valor_venda)
                          )}
                        </td>
                        <td className="w-auto">{produto.est_qtd_atual}</td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
