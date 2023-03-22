import { useEffect, useRef, useState } from "react";
import { Produtos } from "../ItensVenda/Produtos";
import { Sacola } from "../Vendas/Sacola";
import { sacolaProp } from "../../interfaces/interfaceSacola";
import { produtoAtivosProps } from "../../interfaces/interfaceProdutosAtivos";
import { buscarListaProdutoAtivo } from "../../controllers/ProdutoController";
import { ProdutosPlaceholder } from "../Loaders/ProdutosPlaceholder";
import {
  formatarValorMoeda,
  mascaraValorMoedaBrasileira,
} from "../../controllers/NumeroController";
import { Alerta } from "../Alerta";
import {
  finalizarVendaLocalFiado,
  finalizarVendaLocalNormal,
} from "../../controllers/VendaController";
import { Spinner } from "../Loaders/Spinner";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";

export function Vendas() {
  const [qtdItensProduto, setarQtdItem] = useState<number>(1);
  const [itensSacola, setarItensSacola] = useState<sacolaProp[]>([]);
  const [totalCompra, setarTotalCompra] = useState<number>(0);
  const [listaProduto, setarListaProduto] = useState<produtoAtivosProps[]>([]);

  const [carregandoListaProdutos, carregarListaProdutos] = useState(false);
  const [processandoVenda, processarVenda] = useState(false);
  const [vendaFiado, setarVendaFiado] = useState(false);

  const [valorPago, setarValorPago] = useState<string>("");
  const [valorDesconto, setarValorDesconto] = useState<string>("0,00");
  const [nomeClienteFiado, setarNomeClienteFiado] = useState<string | null>(
    null
  );
  const [tipoPagamento, selecionarTipoPagamento] = useState<string>("");

  const [listaProdutoFiltrado, setarFiltroProduto] = useState<
    produtoAtivosProps[]
  >([]);

  const [filtroProduto, setarFiltro] = useState<string>("");

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const refFiltro = useRef<HTMLInputElement | null>(null);

  function excluirItem(index: number) {
    if (index > -1) {
      itensSacola.splice(index, 1);

      if (refFiltro.current) {
        refFiltro.current.focus();
      }
    }
  }

  function adicionaItemSacola(qtdAtualEstoque: number, item: sacolaProp) {
    if (verificaDisponibilidadeProdutoEstoque(qtdAtualEstoque, item.pro_id)) {
      alertarMensagemSistema(
        "warning",
        "Não possuímos essa quantidade de produto no estoque!"
      );
    } else if (item.scl_qtd > qtdAtualEstoque) {
      alertarMensagemSistema(
        "warning",
        "Não possuímos essa quantidade de produto no estoque!"
      );
    } else {
      setarItensSacola([...itensSacola, item].reverse());
      somaValorItemDoTotal(item.scl_sub_total);
      setarFiltro("");

      if (refFiltro.current) {
        refFiltro.current.focus();
      }
    }
  }

  function verificaDisponibilidadeProdutoEstoque(
    qtdAtualEstoque: number,
    tokenProduto: string
  ): boolean {
    const somaItensProdutoAdicionado = itensSacola.reduce(
      (somatoriaQtd, produto) => {
        if (produto.pro_id === tokenProduto)
          return somatoriaQtd + produto.scl_qtd;

        return 0;
      },
      0
    );

    return somaItensProdutoAdicionado >= qtdAtualEstoque;
  }

  function descontaValorItemDoTotal(subTotalItem: number) {
    let totalSacola = totalCompra - Number(subTotalItem);

    if (totalSacola > 0) {
      setarTotalCompra(totalSacola);
    } else {
      setarTotalCompra(0);
    }
  }

  function somaValorItemDoTotal(subTotalItem: number) {
    setarTotalCompra(totalCompra + Number(subTotalItem));
  }

  async function buscaListaProdutoAtivos() {
    carregarListaProdutos(true);

    setarListaProduto(await buscarListaProdutoAtivo());

    carregarListaProdutos(false);

    if (refFiltro.current) {
      refFiltro.current.focus();
    }
  }

  function buscaProdutoNomeOuCodigoBarras(filtro: string) {
    if (filtro.length > 0) {
      let verificaTipoFiltro = new RegExp("^[0-9]+$");

      if (verificaTipoFiltro.test(filtro)) {
        let produto = filtraProdutoCodigoBarras(filtro);

        if (produto) {
          adicionaItemSacola(produto.est_qtd_atual, {
            scl_qtd: qtdItensProduto,
            scl_sub_total: (produto?.pro_valor ?? 0) * qtdItensProduto,
            pro_id: produto?.pro_id ?? "",
            pro_nome: produto?.pro_nome ?? "",
          });

          setarQtdItem(1);
        }
      } else {
        setarFiltroProduto(filtraProdutoNome(filtro));
      }
    } else {
      setarFiltroProduto([]);
    }
  }

  function filtraProdutoNome(filtro: string): produtoAtivosProps[] {
    return listaProduto.filter((produto) =>
      produto.pro_nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  function filtraProdutoCodigoBarras(
    filtro: string
  ): produtoAtivosProps | undefined {
    return listaProduto.find((produto: produtoAtivosProps) =>
      produto.pro_codigos.some(
        (codigoBarras) => codigoBarras.pcb_codigo === filtro
      )
    );
  }

  useEffect(() => {
    const labelTotalVenda = document.getElementById("venTotal");

    if (labelTotalVenda) {
      labelTotalVenda.innerHTML = mascaraValorMoedaBrasileira(totalCompra);
    }

    const labelValorVenda = document.getElementById("valorTotalVenda");

    if (labelValorVenda) {
      labelValorVenda.innerHTML = mascaraValorMoedaBrasileira(totalCompra);
    }
  }, [totalCompra]);

  useEffect(() => {
    buscaProdutoNomeOuCodigoBarras(filtroProduto);
  }, [filtroProduto]);

  useEffect(() => {
    buscaListaProdutoAtivos();
  }, []);

  useEffect(() => {
    let valorTotalCompra:number = totalCompra;

    const labelTotalVenda = document.getElementById("venTotal");
    const labelValorVenda = document.getElementById("valorTotalVenda");

    if (parseFloat(valorDesconto) > 0) {
      
      valorTotalCompra = valorTotalCompra - parseFloat(valorDesconto);
      if (labelTotalVenda) labelTotalVenda.innerHTML = mascaraValorMoedaBrasileira(valorTotalCompra);
      if (labelValorVenda) labelValorVenda.innerHTML = mascaraValorMoedaBrasileira(valorTotalCompra);
    }
    else{
      if (labelTotalVenda) labelTotalVenda.innerHTML = mascaraValorMoedaBrasileira(totalCompra);
      if (labelValorVenda) labelValorVenda.innerHTML = mascaraValorMoedaBrasileira(totalCompra);
    }

    const valorTroco = parseFloat(valorPago) - valorTotalCompra;

    const labelTroco = document.getElementById(
      "valorTotalTroco"
    ) as HTMLInputElement;

    if (labelTroco)
      labelTroco.innerHTML =
        "Troco " +
        mascaraValorMoedaBrasileira(valorTroco > 0 ? valorTroco : 0.0);
  }, [valorPago, valorDesconto]);

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function enviaDadosVenda() {
    processarVenda(true);

    let retornoRequisicao: retornoRequisicaoProps;

    if (!vendaFiado) {
      const selectTipoPagamento = document.getElementById("tipoPagamento");

      if (tipoPagamento === "") {
        selectTipoPagamento?.classList.add("border-danger");
        retornoRequisicao = {
          status: false,
          msg: "Tipo de pagamento não informado",
        };
      } else {
        if (selectTipoPagamento?.classList.contains("border-danger")) {
          selectTipoPagamento?.classList.remove("border-danger");
        }

        retornoRequisicao = await finalizarVendaLocalNormal(
          totalCompra,
          parseFloat(valorDesconto),
          itensSacola,
          tipoPagamento
        );
      }
    } else {
      const inputNomeCliente = document.getElementById("nomeClienteFiado");

      if (nomeClienteFiado === null || nomeClienteFiado === "") {
        inputNomeCliente?.classList.add("border-danger");

        retornoRequisicao = {
          status: false,
          msg: "Nome do cliente não informado",
        };
      } else {
        if (inputNomeCliente?.classList.contains("border-danger"))
          inputNomeCliente?.classList.remove("border-danger");

        retornoRequisicao = await finalizarVendaLocalFiado(
          totalCompra,
          nomeClienteFiado,
          itensSacola
        );
      }
    }

    if (retornoRequisicao.status) {
      limpaDadosVenda();
      alertarMensagemSistema("success", retornoRequisicao.msg);
    } else {
      alertarMensagemSistema("warning", retornoRequisicao.msg);
    }

    processarVenda(false);

    buscaListaProdutoAtivos();
  }

  function limpaDadosVenda() {
    setarFiltroProduto([]);
    setarItensSacola([]);
    setarValorDesconto("0");
    setarValorPago("0");
    setarVendaFiado(false);
    setarNomeClienteFiado("");
    setarTotalCompra(0);
    setarQtdItem(1);
    selecionarTipoPagamento("");
  }

  return (
    <>
      <div className="row mt-5 mb-3">
        {processandoVenda ? (
          <div className="row">
            <Spinner />
          </div>
        ) : (
          <></>
        )}
        {mensagemAlerta !== null ? (
          <div className="row">
            <div className="col-12">
              <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="row row-cols-lg-auto g-2">
        <div className="col-lg-2 col-md-4 col-sm">
          <div className="form-floating mb-3">
            <input
              type="number"
              disabled={carregandoListaProdutos}
              autoComplete="off"
              className="form-control"
              key="qtdAdicionarProduto"
              placeholder="Quantidade de itens a ser adicionado"
              value={qtdItensProduto}
              onChange={(event) => {
                setarQtdItem(event.target.valueAsNumber);
              }}
            />
            <label htmlFor="qtdAdicionarProduto">
              Quantidade de itens a ser adicionado
            </label>
          </div>
        </div>
        <div className="col-lg-8 col-md col-sm">
          <div className="form-floating mb-3">
            <input
              ref={refFiltro}
              type="text"
              disabled={carregandoListaProdutos}
              autoFocus={true}
              autoComplete="off"
              className="form-control"
              key="produtoPesquisa"
              placeholder="Buscar por nome do produto ou codigo de barras"
              value={filtroProduto}
              onChange={(event) => {
                setarFiltro(event.target.value);
              }}
            />
            <label htmlFor="produtoPesquisa">
              Buscar por nome do produto ou codigo de barras
            </label>
          </div>
        </div>
        <div className="col-lg-2 col-12 mb-3">
          <div className="d-grid">
            <button
              key={"finalizaVenda"}
              type="button"
              className="btn btn-secondary btn-lg shadown my-auto"
              data-bs-toggle="modal"
              data-bs-target="#finalizaVenda"
              disabled={
                carregandoListaProdutos ||
                itensSacola.length === 0 ||
                processandoVenda
              }
            >
              Finalizar venda
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div
          style={{ maxHeight: "35rem" }}
          className="col-lg-9 col-md-6 col-12 overflow-auto "
        >
          {!carregandoListaProdutos ? (
            <div className="d-flex justify-content-center flex-wrap gap-2 mb-5 mt-3">
              {listaProdutoFiltrado.length === 0
                ? listaProduto.map((produto) => {
                    return (
                      <div>
                        <Produtos
                          processandoVenda={processandoVenda}
                          pro_id={produto.pro_id}
                          pro_nome={produto.pro_nome}
                          pro_qtd_atual_estoque={produto.est_qtd_atual}
                          pro_valor={produto.pro_valor}
                          adicionarProduto={(qtdAtualEstoque, item) =>
                            adicionaItemSacola(qtdAtualEstoque, item)
                          }
                        />
                      </div>
                    );
                  })
                : listaProdutoFiltrado.map((produto) => {
                    return (
                      <div>
                        <Produtos
                          processandoVenda={processandoVenda}
                          pro_id={produto.pro_id}
                          pro_nome={produto.pro_nome}
                          pro_valor={produto.pro_valor}
                          pro_qtd_atual_estoque={produto.est_qtd_atual}
                          adicionarProduto={(qtdAtualEstoque, item) =>
                            adicionaItemSacola(qtdAtualEstoque, item)
                          }
                        />
                      </div>
                    );
                  })}
            </div>
          ) : (
            <div className="d-flex justify-content-center flex-wrap">
              <div className="my-2 mx-2">
                <ProdutosPlaceholder />
              </div>
              <div className="my-2 mx-2">
                <ProdutosPlaceholder />
              </div>
              <div className="my-2 mx-2">
                <ProdutosPlaceholder />
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 px-3">
          <div className="d-flex flex-column flex-wrap">
            <div>
              <h3 className="text-center mb-2">Itens do carrinho</h3>
              <div>
                <h1
                  id="venTotal"
                  className="text-center border rounded p-2 mt-1"
                >
                  R$ 0.00
                </h1>
              </div>
              <ul
                className="list-group overflow-auto"
                style={{ maxHeight: "12rem" }}
              >
                {itensSacola.length === 0 ? (
                  <>
                    <hr />
                    <h5 className="text-center">Nenhum item adicionado!</h5>
                  </>
                ) : (
                  itensSacola.map((item: sacolaProp, index: number) => {
                    return (
                      <Sacola
                        processandoVenda={processandoVenda}
                        index={index}
                        scl_qtd={item.scl_qtd}
                        scl_sub_total={item.scl_sub_total}
                        pro_nome={item.pro_nome}
                        excluirItem={(index) => excluirItem(index)}
                        descontarValor={(valorItem) =>
                          descontaValorItemDoTotal(valorItem)
                        }
                      />
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="finalizaVenda"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="finalizaVendaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="finalizaVendaLabel">
                Encerrar venda
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                disabled={processandoVenda}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <h1
                    className="text-center text-muted border rounded p-2 mt-1"
                    id="valorTotalVenda"
                  ></h1>
                </div>
              </div>
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
                        id="normal-tab"
                        onClick={() => setarVendaFiado(false)}
                        data-bs-toggle="tab"
                        data-bs-target="#normal-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="normal-tab-pane"
                        aria-selected="true"
                      >
                        Normal
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link text-bg-light"
                        id="fiado-tab"
                        onClick={() => setarVendaFiado(true)}
                        data-bs-toggle="tab"
                        data-bs-target="#fiado-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="fiado-tab-pane"
                        aria-selected="false"
                      >
                        Fiado
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="normal-tab-pane"
                      role="tabpanel"
                      aria-labelledby="normal-tab"
                      tabIndex={0}
                    >
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              id="tipoPagamento"
                              value={tipoPagamento}
                              onChange={(event) =>
                                selecionarTipoPagamento(event.target.value)
                              }
                              aria-label="Tipo de pagamento"
                            >
                              <option selected disabled value={""}>
                                Selecione
                              </option>
                              <option value="dinheiro">Dinheiro</option>
                              <option value="cartao">Cartão</option>
                            </select>
                            <label htmlFor="tipoPagamento">
                              Tipo de pagamento
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-lg-6 col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              autoComplete="off"
                              key="descontoVenda"
                              placeholder="Desconto"
                              value={valorDesconto ?? "0,00"}
                              onChange={(event) => {
                                setarValorDesconto(
                                  formatarValorMoeda(event.target.value)
                                );
                              }}
                            />
                            <label htmlFor="descontoVenda">Desconto</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-lg-6 col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              autoComplete="off"
                              key="valorPago"
                              placeholder="Valor pago"
                              value={valorPago ?? "0,00"}
                              onChange={(event) => {
                                setarValorPago(
                                  formatarValorMoeda(event.target.value)
                                );
                              }}
                            />
                            <label htmlFor="valorPago">Valor pago</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <h1
                            id="valorTotalTroco"
                            className="text-danger text-center border rounded p-2 mt-1"
                          >
                            Troco R$ 0,00
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="fiado-tab-pane"
                      role="tabpanel"
                      aria-labelledby="fiado-tab"
                      tabIndex={0}
                    >
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              autoComplete="on"
                              id="nomeClienteFiado"
                              className="form-control"
                              placeholder="Nome do cliente"
                              value={nomeClienteFiado ?? ""}
                              onChange={(event) => {
                                setarNomeClienteFiado(event.target.value);
                              }}
                            />
                            <label htmlFor="nomeClienteFiado">
                              Nome do cliente
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                disabled={processandoVenda}
                data-bs-dismiss="modal"
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => enviaDadosVenda()}
                disabled={processandoVenda}
                data-bs-dismiss="modal"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
