import {
  Barcode,
  ClockCounterClockwise,
  Eye,
  EyeSlash,
  Pencil,
} from "phosphor-react";
import { produtoProps } from "../../interfaces/interfaceProdutos";
import { Placeholder } from "../Loaders/Placeholder";
import { ChangeEvent, useState } from "react";
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
  const [filtroProduto, setarFiltroProduto] = useState("");

  const produtosFiltrados =
    filtroProduto.length === 0
      ? []
      : listaProdutos.filter((produto) =>
          produto.pro_nome.toLowerCase().includes(filtroProduto.toLowerCase())
        );

  const aplicaFiltroProduto = (event: ChangeEvent<HTMLInputElement>) => {
    setarFiltroProduto(event.target.value);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 mt-2">
          <div className="form-floating mb-3">
            <input
              type="text"
              autoComplete="off"
              className="form-control"
              id="pro_nome_filtro"
              placeholder="Nome do produto"
              disabled={carregandoListaProdutos}
              onChange={aplicaFiltroProduto}
            />
            <label htmlFor="pro_nome_filtro">
              Pesquisar pelo nome do produto
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive" style={{ maxHeight: "60vh" }}>
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
            <tbody>
              {carregandoListaProdutos ? (
                <>
                  <tr key={self.crypto.randomUUID()}>
                    <th className="w-auto" scope="row">
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
                  <tr key={self.crypto.randomUUID()}>
                    <th className="w-auto" scope="row">
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
                  <tr key={self.crypto.randomUUID()}>
                    <th className="w-auto" scope="row">
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
                  <td
                    key={self.crypto.randomUUID()}
                    colSpan={4}
                    className="text-center p-3"
                  >
                    Nenhum produto encontrado
                  </td>
                </>
              ) : produtosFiltrados.length === 0 ? (
                listaProdutos.map((produto) => {
                  return (
                    <>
                      <tr key={produto.pro_id}>
                        <th className="w-auto" scope="row">
                          <div className="d-flex flex-row flex-wrap justify-content-center justify-content-lg-start gap-1">
                            <button
                              type="button"
                              title="Editar produto"
                              key={produto.pro_id + "-edita_produto"}
                              className="btn btn-warning shadow"
                              disabled={processandoRequisicao}
                              onClick={() => {
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
                                );
                              }}
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
                                onClick={() => {
                                  desativarProduto(produto.pro_id);
                                }}
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
                                onClick={() => {
                                  ativarProduto(produto.pro_id);
                                }}
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
                              className="btn btn-secondary shadow"
                              disabled={processandoRequisicao}
                              onClick={() => {
                                visualizarCodigosBarrasProduto(produto.pro_id);
                              }}
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
                              onClick={() => {
                                visualizarHistoricoEstoqueProduto(
                                  produto.pro_id
                                );
                              }}
                              disabled={processandoRequisicao}
                              data-bs-toggle="modal"
                              data-bs-target="#historicoProdutoModal"
                            >
                              <ClockCounterClockwise
                                size={32}
                                color="#ffffff"
                              />
                            </button>
                          </div>
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
                produtosFiltrados.map((produto) => {
                  return (
                    <>
                      <tr key={produto.pro_id}>
                        <th className="w-auto" scope="row">
                          <div className="d-flex flex-row flex-wrap justify-content-center justify-content-lg-start gap-1">
                            <button
                              type="button"
                              title="Editar produto"
                              key={produto.pro_id + "-edita_produto"}
                              className="btn btn-warning shadow"
                              disabled={processandoRequisicao}
                              onClick={() => {
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
                                );
                              }}
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
                                onClick={() => {
                                  desativarProduto(produto.pro_id);
                                }}
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
                                onClick={() => {
                                  ativarProduto(produto.pro_id);
                                }}
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
                              className="btn btn-secondary shadow"
                              disabled={processandoRequisicao}
                              onClick={() => {
                                visualizarCodigosBarrasProduto(produto.pro_id);
                              }}
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
                              onClick={() => {
                                visualizarHistoricoEstoqueProduto(
                                  produto.pro_id
                                );
                              }}
                              disabled={processandoRequisicao}
                              data-bs-toggle="modal"
                              data-bs-target="#historicoProdutoModal"
                            >
                              <ClockCounterClockwise
                                size={32}
                                color="#ffffff"
                              />
                            </button>
                          </div>
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
