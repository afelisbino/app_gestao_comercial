import { useEffect, useState } from "react";
import { Alerta } from "../../components/Alerta";
import { Spinner } from "../../components/Loaders/Spinner";
import { estoqueProps } from "../../interfaces/interfaceEstoque";
import {
  buscaListaProdutosEstoque,
  registraEntradaProdutoEstoque,
  registraSaidaProdutoEstoque,
} from "../../controllers/EstoqueController";
import {
  ativarProduto,
  desativarProduto,
} from "../../controllers/ProdutoController";

import { ItemEstoque } from "../../components/Estoque/ItemEstoque";
import { PlaceholderCardItemEstoque } from "../../components/Loaders/PlaceholderCardItemEstoque";
import { Minus, Plus } from "phosphor-react";

const Estoque = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [alterandoStatusProdutoEstoque, alterarStatusProdutoEstoque] =
    useState(false);
  const [alterandoEstoque, alterarQuantidadeEstoque] = useState(false);
  const [carregandoListaProdutosEstoque, carregarListaProdutosEstoque] =
    useState(false);

  const [produtoToken, setarProdutoToken] = useState<string | null>(null);
  const [novaQuantidadeEstoque, setarNovaQuantidade] = useState<number>(0);

  const [listaEstoque, setarListaEstoque] = useState<estoqueProps[]>([]);
  const [listaEstoqueFiltrado, setarFiltroEstoque] = useState<estoqueProps[]>(
    []
  );

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function diminuiQuantidadeEstoque() {
    setarNovaQuantidade((novaQuantidadeEstoque) => novaQuantidadeEstoque - 1);
  }

  function aumentaQuantidadeEstoque() {
    setarNovaQuantidade((novaQuantidadeEstoque) => novaQuantidadeEstoque + 1);
  }

  function zeraQuantidadeEstoque() {
    setarNovaQuantidade(0);
  }

  function alteraQuantidadeProdutoEstoque() {
    if (produtoToken) {
      if (novaQuantidadeEstoque > 0) {
        salvaEntradaEstoque(produtoToken, novaQuantidadeEstoque);
      } else if (novaQuantidadeEstoque < 0) {
        salvaSaidaEstoque(produtoToken, novaQuantidadeEstoque);
      } else {
        alertarMensagemSistema(
          "warning",
          "Quantidade precisa ser diferente de zero!"
        );
      }
    }
    zeraQuantidadeEstoque();
  }

  async function ativarProdutoEstoque(pro_id: string) {
    alterarStatusProdutoEstoque(true);

    await ativarProduto(pro_id);

    alterarStatusProdutoEstoque(false);
    buscaListaProdutoEstoque();
  }

  async function desativarProdutoEstoque(pro_id: string) {
    alterarStatusProdutoEstoque(true);

    await desativarProduto(pro_id);

    alterarStatusProdutoEstoque(false);
    buscaListaProdutoEstoque();
  }

  async function salvaEntradaEstoque(pro_id: string, quantidade: number) {
    alterarQuantidadeEstoque(true);

    const response = await registraEntradaProdutoEstoque(pro_id, quantidade);

    alterarQuantidadeEstoque(false);
    buscaListaProdutoEstoque();

    alertarMensagemSistema(
      response.status ? "success" : "warning",
      response.msg
    );
  }

  async function salvaSaidaEstoque(pro_id: string, quantidade: number) {
    alterarQuantidadeEstoque(true);

    const response = await registraSaidaProdutoEstoque(pro_id, quantidade);

    alterarQuantidadeEstoque(false);
    buscaListaProdutoEstoque();

    alertarMensagemSistema(
      response.status ? "success" : "warning",
      response.msg
    );
  }

  async function buscaListaProdutoEstoque() {
    carregarListaProdutosEstoque(true);
    setarListaEstoque(await buscaListaProdutosEstoque());
    carregarListaProdutosEstoque(false);
  }

  function filtraProdutoCodigoBarras(filtro: string): estoqueProps | undefined {
    return listaEstoque.find((produto: estoqueProps) =>
      produto.pro_codigos.some((codigoBarras) => codigoBarras === filtro)
    );
  }

  function filtraProdutoNome(filtro: string): estoqueProps[] {
    return listaEstoque.filter((produto: estoqueProps) =>
      produto.pro_nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  function buscaProdutoNomeOuCodigoBarras(filtro: string) {
    const verificaTipoFiltro = new RegExp("^[0-9]+$");

    if (filtro.length > 0) {
      if (verificaTipoFiltro.test(filtro)) {
        let produto = filtraProdutoCodigoBarras(filtro);

        if (produto) {
          setarFiltroEstoque([produto]);
        }
      } else {
        setarFiltroEstoque(filtraProdutoNome(filtro));
      }
    } else {
      setarFiltroEstoque([]);
    }
  }

  useEffect(() => {
    buscaListaProdutoEstoque();
  }, []);

  return (
    <>
      {mensagemAlerta !== null ? (
        <div className="row">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      {alterandoStatusProdutoEstoque || alterandoEstoque ? (
        <div className="row">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      <div className="row">
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              disabled={carregandoListaProdutosEstoque}
              autoComplete="on"
              className="form-control"
              key="produtoPesquisa"
              placeholder="Buscar por nome do produto ou codigo de barras"
              onChange={(event) => {
                buscaProdutoNomeOuCodigoBarras(event.target.value);
              }}
            />
            <label htmlFor="produtoPesquisa">
              Buscar por nome do produto ou codigo de barras
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          <ul
            className="nav nav-tabs justify-content-center"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light active"
                id="visaoGeral-tab"
                data-bs-toggle="tab"
                data-bs-target="#visaoGeral-tab-pane"
                type="button"
                role="tab"
                aria-controls="visaoGeral-tab-pane"
                aria-selected="true"
              >
                Visão Geral
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="minimo-tab"
                data-bs-toggle="tab"
                data-bs-target="#minimo-tab-pane"
                type="button"
                role="tab"
                aria-controls="minimo-tab-pane"
                aria-selected="false"
              >
                Estoque Minimo
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="zerado-tab"
                data-bs-toggle="tab"
                data-bs-target="#zerado-tab-pane"
                type="button"
                role="tab"
                aria-controls="zerado-tab-pane"
                aria-selected="false"
              >
                Estoque Zerado
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="desativado-tab"
                data-bs-toggle="tab"
                data-bs-target="#desativado-tab-pane"
                type="button"
                role="tab"
                aria-controls="desativado-tab-pane"
                aria-selected="false"
              >
                Estoque Desativado
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="visaoGeral-tab-pane"
              role="tabpanel"
              aria-labelledby="visaoGeral-tab"
              tabIndex={0}
            >
              <div
                className="d-flex flex-row flex-wrap justify-content-center overflow-auto gap-2 pt-3"
                style={{ maxHeight: "75vh" }}
              >
                {carregandoListaProdutosEstoque ? (
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
                ) : listaEstoqueFiltrado.length === 0 ? (
                  listaEstoque.map((produto) => {
                    return (
                      <>
                        <div className="col-auto mx-auto">
                          <ItemEstoque
                            pro_id={produto.pro_id}
                            pro_nome={produto.pro_nome}
                            pro_qtd_atual={produto.pro_qtd_atual}
                            pro_qtd_minimo={produto.pro_qtd_minimo}
                            pro_disponivel={produto.pro_disponivel}
                            alterarEstoque={(pro_id) =>
                              setarProdutoToken(pro_id)
                            }
                            alterandoQuantidadeEstoque={alterandoEstoque}
                            alterandoStatusProduto={
                              alterandoStatusProdutoEstoque
                            }
                            ativarProdutoEstoque={(pro_id) => {
                              ativarProdutoEstoque(pro_id);
                            }}
                            desativarProdutoEstoque={(pro_id) => {
                              desativarProdutoEstoque(pro_id);
                            }}
                          />
                        </div>
                      </>
                    );
                  })
                ) : (
                  listaEstoqueFiltrado.map((produto) => {
                    return (
                      <>
                        <div className="col-auto mx-auto">
                          <ItemEstoque
                            pro_id={produto.pro_id}
                            pro_nome={produto.pro_nome}
                            pro_qtd_atual={produto.pro_qtd_atual}
                            pro_qtd_minimo={produto.pro_qtd_minimo}
                            pro_disponivel={produto.pro_disponivel}
                            alterarEstoque={(pro_id) =>
                              setarProdutoToken(pro_id)
                            }
                            alterandoQuantidadeEstoque={alterandoEstoque}
                            alterandoStatusProduto={
                              alterandoStatusProdutoEstoque
                            }
                            ativarProdutoEstoque={(pro_id) => {
                              ativarProdutoEstoque(pro_id);
                            }}
                            desativarProdutoEstoque={(pro_id) => {
                              desativarProdutoEstoque(pro_id);
                            }}
                          />
                        </div>
                      </>
                    );
                  })
                )}
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="minimo-tab-pane"
              role="tabpanel"
              aria-labelledby="minimo-tab"
              tabIndex={0}
            >
              <div
                className="d-flex flex-row flex-wrap justify-content-center overflow-auto gap-2 pt-3"
                style={{ maxHeight: "75vh" }}
              >
                {carregandoListaProdutosEstoque ? (
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
                ) : listaEstoqueFiltrado.length === 0 ? (
                  listaEstoque.map((produto) => {
                    if (
                      produto.pro_qtd_atual <= produto.pro_qtd_minimo &&
                      produto.pro_qtd_atual > 0
                    ) {
                      return (
                        <>
                          <div className="col-auto mx-auto">
                            <ItemEstoque
                              pro_id={produto.pro_id}
                              pro_nome={produto.pro_nome}
                              pro_qtd_atual={produto.pro_qtd_atual}
                              pro_qtd_minimo={produto.pro_qtd_minimo}
                              pro_disponivel={produto.pro_disponivel}
                              alterarEstoque={(pro_id) =>
                                setarProdutoToken(pro_id)
                              }
                              alterandoQuantidadeEstoque={alterandoEstoque}
                              alterandoStatusProduto={
                                alterandoStatusProdutoEstoque
                              }
                              ativarProdutoEstoque={(pro_id) => {
                                ativarProdutoEstoque(pro_id);
                              }}
                              desativarProdutoEstoque={(pro_id) => {
                                desativarProdutoEstoque(pro_id);
                              }}
                            />
                          </div>
                        </>
                      );
                    }
                  })
                ) : (
                  listaEstoqueFiltrado.map((produto) => {
                    if (
                      produto.pro_qtd_atual <= produto.pro_qtd_minimo &&
                      produto.pro_qtd_atual > 0
                    ) {
                      return (
                        <>
                          <div className="col-auto mx-auto">
                            <ItemEstoque
                              pro_id={produto.pro_id}
                              pro_nome={produto.pro_nome}
                              pro_qtd_atual={produto.pro_qtd_atual}
                              pro_qtd_minimo={produto.pro_qtd_minimo}
                              pro_disponivel={produto.pro_disponivel}
                              alterarEstoque={(pro_id) =>
                                setarProdutoToken(pro_id)
                              }
                              alterandoQuantidadeEstoque={alterandoEstoque}
                              alterandoStatusProduto={
                                alterandoStatusProdutoEstoque
                              }
                              ativarProdutoEstoque={(pro_id) => {
                                ativarProdutoEstoque(pro_id);
                              }}
                              desativarProdutoEstoque={(pro_id) => {
                                desativarProdutoEstoque(pro_id);
                              }}
                            />
                          </div>
                        </>
                      );
                    }
                  })
                )}
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="zerado-tab-pane"
              role="tabpanel"
              aria-labelledby="zerado-tab"
              tabIndex={0}
            >
              <div
                className="d-flex flex-row flex-wrap justify-content-center overflow-auto gap-2 pt-3"
                style={{ maxHeight: "75vh" }}
              >
                {carregandoListaProdutosEstoque ? (
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
                ) : listaEstoqueFiltrado.length === 0 ? (
                  listaEstoque.map((produto) => {
                    if (produto.pro_qtd_atual === 0) {
                      return (
                        <>
                          <div className="col-auto mx-auto">
                            <ItemEstoque
                              pro_id={produto.pro_id}
                              pro_nome={produto.pro_nome}
                              pro_qtd_atual={produto.pro_qtd_atual}
                              pro_qtd_minimo={produto.pro_qtd_minimo}
                              pro_disponivel={produto.pro_disponivel}
                              alterarEstoque={(pro_id) =>
                                setarProdutoToken(pro_id)
                              }
                              alterandoQuantidadeEstoque={alterandoEstoque}
                              alterandoStatusProduto={
                                alterandoStatusProdutoEstoque
                              }
                              ativarProdutoEstoque={(pro_id) => {
                                ativarProdutoEstoque(pro_id);
                              }}
                              desativarProdutoEstoque={(pro_id) => {
                                desativarProdutoEstoque(pro_id);
                              }}
                            />
                          </div>
                        </>
                      );
                    }
                  })
                ) : (
                  listaEstoqueFiltrado.map((produto) => {
                    if (produto.pro_qtd_atual === 0) {
                      return (
                        <>
                          <div className="col-auto mx-auto">
                            <ItemEstoque
                              pro_id={produto.pro_id}
                              pro_nome={produto.pro_nome}
                              pro_qtd_atual={produto.pro_qtd_atual}
                              pro_qtd_minimo={produto.pro_qtd_minimo}
                              pro_disponivel={produto.pro_disponivel}
                              alterarEstoque={(pro_id) =>
                                setarProdutoToken(pro_id)
                              }
                              alterandoQuantidadeEstoque={alterandoEstoque}
                              alterandoStatusProduto={
                                alterandoStatusProdutoEstoque
                              }
                              ativarProdutoEstoque={(pro_id) => {
                                ativarProdutoEstoque(pro_id);
                              }}
                              desativarProdutoEstoque={(pro_id) => {
                                desativarProdutoEstoque(pro_id);
                              }}
                            />
                          </div>
                        </>
                      );
                    }
                  })
                )}
              </div>
            </div>
            
            <div
              className="tab-pane fade"
              id="desativado-tab-pane"
              role="tabpanel"
              aria-labelledby="desativado-tab"
              tabIndex={0}
            >
              <div className="row">
                <div className="d-flex flex-wrap justify-content-center overflow-auto gap-2">
                  {carregandoListaProdutosEstoque ? (
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
                  ) : listaEstoqueFiltrado.length === 0 ? (
                    listaEstoque.map((produto) => {
                      if (!produto.pro_disponivel) {
                        return (
                          <>
                            <div className="col-auto">
                              <ItemEstoque
                                pro_id={produto.pro_id}
                                pro_nome={produto.pro_nome}
                                pro_qtd_atual={produto.pro_qtd_atual}
                                pro_qtd_minimo={produto.pro_qtd_minimo}
                                pro_disponivel={produto.pro_disponivel}
                                alterarEstoque={(pro_id) =>
                                  setarProdutoToken(pro_id)
                                }
                                alterandoQuantidadeEstoque={alterandoEstoque}
                                alterandoStatusProduto={
                                  alterandoStatusProdutoEstoque
                                }
                                ativarProdutoEstoque={(pro_id) => {
                                  ativarProdutoEstoque(pro_id);
                                }}
                                desativarProdutoEstoque={(pro_id) => {
                                  desativarProdutoEstoque(pro_id);
                                }}
                              />
                            </div>
                          </>
                        );
                      }
                    })
                  ) : (
                    listaEstoqueFiltrado.map((produto) => {
                      if (!produto.pro_disponivel) {
                        return (
                          <>
                            <div className="col-auto">
                              <ItemEstoque
                                pro_id={produto.pro_id}
                                pro_nome={produto.pro_nome}
                                pro_qtd_atual={produto.pro_qtd_atual}
                                pro_qtd_minimo={produto.pro_qtd_minimo}
                                pro_disponivel={produto.pro_disponivel}
                                alterarEstoque={(pro_id) =>
                                  setarProdutoToken(pro_id)
                                }
                                alterandoQuantidadeEstoque={alterandoEstoque}
                                alterandoStatusProduto={
                                  alterandoStatusProdutoEstoque
                                }
                                ativarProdutoEstoque={(pro_id) => {
                                  ativarProdutoEstoque(pro_id);
                                }}
                                desativarProdutoEstoque={(pro_id) => {
                                  desativarProdutoEstoque(pro_id);
                                }}
                              />
                            </div>
                          </>
                        );
                      }
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="alterarQuantidadeEstoqueModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Alterar quantidade do estoque</h5>
              <button
                type="button"
                className="btn-close"
                disabled={alterandoEstoque}
                onClick={() => {
                  zeraQuantidadeEstoque();
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="d-inline-flex justify-content-cente align-items-center">
                  <div className="col-2">
                    <button
                      className="btn btn-danger btn-lg"
                      disabled={alterandoEstoque}
                      onClick={() => diminuiQuantidadeEstoque()}
                    >
                      <Minus size={32} color="#ffffff" />
                    </button>
                  </div>
                  <div className="col-auto mx-auto">
                    <input
                      type="number"
                      name="pro_qtd_atual"
                      disabled={alterandoEstoque}
                      id="pro_qtd_atual"
                      className="form-control form-control-lg text-center"
                      value={novaQuantidadeEstoque}
                      onChange={(event) =>
                        setarNovaQuantidade(event.target.valueAsNumber)
                      }
                    />
                  </div>
                  <div className="col-2">
                    <button
                      className="btn btn-success btn-lg"
                      disabled={alterandoEstoque}
                      onClick={() => aumentaQuantidadeEstoque()}
                    >
                      <Plus size={32} color="#ffffff" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                disabled={alterandoEstoque}
                onClick={() => {
                  zeraQuantidadeEstoque();
                }}
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={alterandoEstoque}
                onClick={() => {
                  alteraQuantidadeProdutoEstoque();
                }}
                data-bs-dismiss="modal"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estoque;
