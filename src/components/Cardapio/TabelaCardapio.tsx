import { Eye, EyeSlash, Pencil, TrashSimple } from "phosphor-react";
import { Placeholder } from "../Loaders/Placeholder";
import { cardapioProps } from "../../interfaces/interfaceCardapio";
import { OpcaoCategoria } from "../Categorias/OpcaoCategoria";
import { useEffect, useState } from "react";
import { categoriaProps } from "../../interfaces/interfaceCategoria";
import { buscarListaCategoria } from "../../controllers/CategoriaController";
import { PlaceholderButton } from "../Loaders/PlaceholderButton";

interface tabelaProps {
  editar: (
    id: string,
    nome: string,
    valor: number,
    idCategoria: string,
    descricao: string | null
  ) => void;
  mudarStatus: (id: string, disponivel: boolean) => void;
  listarCardapio: cardapioProps[];
  carregandoCardapio: boolean;
  processandoRequisicao: boolean;
}

export function TabelaCardapio({
  listarCardapio,
  carregandoCardapio,
  processandoRequisicao,
  editar,
  mudarStatus,
}: tabelaProps) {
  const [categoriaSelecionado, selecionarOpcaoCategoria] = useState<string>("");
  const [listaFiltroProduto, filtroProduto] = useState<cardapioProps[]>([]);
  const [nomeProdutoFiltro, setarNomeProduto] = useState<string>("");

  const [listaCategorias, setarListaCategorias] = useState<categoriaProps[]>(
    []
  );
  const [carregandoCategorias, carregarCategorias] = useState(false);

  function filtrarProdutosCategoria(categoriaEscolhido: string) {
    filtroProduto(
      listarCardapio.filter((el: cardapioProps) =>
        el["cat_id"].includes(categoriaEscolhido)
      )
    );

    selecionarOpcaoCategoria(categoriaEscolhido);
  }

  function filtrarProdutoNome(nomeProduto: string) {
    if (nomeProduto.length === 0) {
      if (!categoriaSelecionado) {
        filtroProduto([]);
      } else {
        filtrarProdutosCategoria(categoriaSelecionado);
      }
    } else {
      if (categoriaSelecionado !== "") {
        let filtroProdutoCategoria: cardapioProps[] = listarCardapio.filter(
          (el: cardapioProps) => el["cat_id"].includes(categoriaSelecionado)
        );

        filtroProduto(
          filtroProdutoCategoria.filter((el: cardapioProps) =>
            el["cdp_nome"].toLowerCase().includes(nomeProduto.toLowerCase())
          )
        );
      } else {
        filtroProduto(
          listarCardapio.filter((el: cardapioProps) =>
            el["cdp_nome"].toLowerCase().includes(nomeProduto.toLowerCase())
          )
        );
      }
    }

    setarNomeProduto(nomeProduto);
  }

  async function listarCategorias() {
    carregarCategorias(true);

    setarListaCategorias(await buscarListaCategoria());

    carregarCategorias(false);
  }

  function limparFiltro() {
    filtroProduto([]);
    selecionarOpcaoCategoria("");
    setarNomeProduto("");
  }

  useEffect(() => {
    listarCategorias();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-4 col-lg-4">
          <OpcaoCategoria
            listaCategoria={listaCategorias}
            carregandoCategorias={carregandoCategorias}
            nomeSelect="cat_id_filtro"
            categoriaEscolhida={categoriaSelecionado}
            selecionarOpcaoCategoria={filtrarProdutosCategoria}
          />
        </div>
        <div className="col-sm-12 col-md-8 col-lg-8">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="filtroNomeProduto"
              placeholder="Filtrar Produto"
              value={nomeProdutoFiltro ?? ""}
              onChange={(event) => filtrarProdutoNome(event.target.value)}
            />
            <label htmlFor="filtroNomeProduto">Filtrar Produto</label>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <button
            className="btn btn-lg btn-warning shadow"
            onClick={limparFiltro}
          >
            Limpar filtros
          </button>
        </div>
      </div>
      <div className="table-responsive mt-3" style={{ maxHeight: "20rem" }}>
        <table className="table border rounded">
          <caption>Lista de produtos</caption>
          <thead>
            <tr>
              <th scope="col">Opções</th>
              <th scope="col">Nome</th>
              <th scope="col">Valor R$</th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {carregandoCardapio ? (
              <>
                <tr>
                  <th scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td>
                    <Placeholder />
                  </td>
                  <td>
                    <Placeholder />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td>
                    <Placeholder />
                  </td>
                  <td>
                    <Placeholder />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceholderButton />
                    <PlaceholderButton />
                  </th>
                  <td>
                    <Placeholder />
                  </td>
                  <td>
                    <Placeholder />
                  </td>
                </tr>
              </>
            ) : listarCardapio.length === 0 ? (
              <>
                <td colSpan={4} className="text-center p-3">
                  Nenhum produto encontrado
                </td>
              </>
            ) : listaFiltroProduto.length === 0 ? (
              listarCardapio.map((cardapio) => {
                return (
                  <>
                    <tr>
                      <th scope="row" className="w-25">
                        <button
                          type="button"
                          title="Editar Produto"
                          className="btn btn-warning shadow m-1"
                          disabled={processandoRequisicao}
                          onClick={() => {
                            editar(
                              cardapio.cdp_id,
                              cardapio.cdp_nome,
                              cardapio.cdp_valor,
                              cardapio.cat_id,
                              cardapio.cdp_descricao ?? null
                            );
                          }}
                        >
                          <Pencil size={32} color="#ffffff" />
                        </button>
                        {cardapio.cdp_disponivel ? (
                          <button
                            type="button"
                            title="Desativar Produto"
                            className="btn btn-danger shadow"
                            disabled={processandoRequisicao}
                            onClick={() => {
                              mudarStatus(cardapio.cdp_id, false);
                            }}
                          >
                            <EyeSlash size={32} color="#ffffff" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Ativar Produto"
                            className="btn btn-success shadow"
                            disabled={processandoRequisicao}
                            onClick={() => {
                              mudarStatus(cardapio.cdp_id, true);
                            }}
                          >
                            <Eye size={32} color="#ffffff" />
                          </button>
                        )}
                      </th>
                      <td>{cardapio.cdp_nome}</td>
                      <td>{"R$ " + cardapio.cdp_valor}</td>
                    </tr>
                  </>
                );
              })
            ) : (
              listaFiltroProduto.map((cardapio) => {
                return (
                  <>
                    <tr>
                      <th scope="row" className="w-25">
                        <button
                          type="button"
                          title="Editar Produto"
                          className="btn btn-warning shadow m-1"
                          disabled={processandoRequisicao}
                          onClick={() => {
                            editar(
                              cardapio.cdp_id,
                              cardapio.cdp_nome,
                              cardapio.cdp_valor,
                              cardapio.cat_id,
                              cardapio.cdp_descricao ?? null
                            );
                          }}
                        >
                          <Pencil size={32} color="#ffffff" />
                        </button>
                        {cardapio.cdp_disponivel ? (
                          <button
                            type="button"
                            title="Desativar Produto"
                            className="btn btn-danger shadow"
                            disabled={processandoRequisicao}
                            onClick={() => {
                              mudarStatus(cardapio.cdp_id, false);
                            }}
                          >
                            <EyeSlash size={32} color="#ffffff" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Ativar Produto"
                            className="btn btn-success shadow"
                            disabled={processandoRequisicao}
                            onClick={() => {
                              mudarStatus(cardapio.cdp_id, true);
                            }}
                          >
                            <Eye size={32} color="#ffffff" />
                          </button>
                        )}
                      </th>
                      <td>{cardapio.cdp_nome}</td>
                      <td>{"R$ " + cardapio.cdp_valor}</td>
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
