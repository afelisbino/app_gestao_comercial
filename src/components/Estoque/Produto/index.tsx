import { FormEvent, useEffect, useState } from "react";
import { buscarListaCategoria } from "../../../controllers/CategoriaController";
import { buscarListaFornecedores } from "../../../controllers/FornecedorController";
import {
  formatarValorMoeda,
  mascaraValorMoedaBrasileira,
} from "../../../controllers/NumeroController";
import {
  buscarListaTodosProdutos,
  buscarListaCodigoBarrasProduto,
  deletarCodigoBarrasProduto,
  adicionarNovoCodigoBarrasProduto,
  cadastrarProduto,
  alterarProduto,
  ativarProduto,
  desativarProduto,
  buscarListaHistoricoProduto,
} from "../../../controllers/ProdutoController";
import { categoriaProps } from "../../../interfaces/interfaceCategoria";
import { codigoBarrasProps } from "../../../interfaces/interfaceCodigoBarrasProduto";
import { fornecedorProps } from "../../../interfaces/interfaceFornecedor";
import { historicoProdutoEstoqueProps } from "../../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { produtoProps } from "../../../interfaces/interfaceProdutos";
import { retornoRequisicaoProps } from "../../../interfaces/interfaceReturnoRequisicao";
import { Alerta } from "../../Alerta";
import { OpcaoCategoria } from "../../Categorias/OpcaoCategoria";
import { OpcaoFornecedor } from "../../Fornecedores/OpcaoFornecedor";
import { TabelaProdutos } from "../TabelaProdutos";
import { TabelaCodigoBarras } from "./CodigoBarras/TabelaCodigoBarras";
import { TabelaHistoricoEstoqueProduto } from "./TabelaHistoricoEstoqueProduto";
import { Spinner } from "../../Loaders/Spinner";

export function Produto() {
  const [listaProdutos, setarListaProdutos] = useState<produtoProps[]>([]);
  const [carregandoListaProdutos, carregarListaProdutos] = useState(false);

  const [listaCategorias, setarListaCategorias] = useState<categoriaProps[]>(
    []
  );
  const [carregandoCategorias, carregarCategorias] = useState(false);
  const [listaFornecedores, setarListaFornecedor] = useState<fornecedorProps[]>(
    []
  );
  const [carregandoFornecedores, carregarFornecedor] = useState(false);
  const [categoriaSelecionado, selecionarOpcaoCategoria] = useState<string>("");
  const [fornecedorSelecionado, selecionarOpcaoFornecedor] =
    useState<string>("");

  const [tokenProduto, setarTokenProduto] = useState<string | null>(null);

  const [nomeProduto, setarNomeProduto] = useState<string | null>(null);
  const [descricaoProduto, setarDescricaoProduto] = useState<string | null>(
    null
  );

  const [qtdAtualProduto, setarQtdAtual] = useState<number>(0);
  const [qtdMinimaProduto, setarQtdMinima] = useState<number>(0);

  const [precoVendaProduto, setarPrecoVenda] = useState<string>("");
  const [valorCustoProduto, setarValorCustoProduto] = useState<string>("");
  const [valorLucro, setarValorLucroProduto] = useState<string>("0.00");
  const [porcentagemLucro, setarPorcentagemLucroProduto] = useState<string>("0.00");

  const [listaCodigoBarras, setarListaCodigoBarras] = useState<
    codigoBarrasProps[]
  >([]);
  const [carregandoListaCodigosBarras, carregarListaCodigosBarras] =
    useState(false);
  const [codigoBarraProduto, setarCodigoBarraProduto] = useState<string | null>(
    null
  );

  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [listaHistoricoProduto, setarListaHistoricoProduto] = useState<
    historicoProdutoEstoqueProps[]
  >([]);
  const [carregandoListaHistorico, carregarListaHistoricoProduto] =
    useState(false);

  function editarProduto(
    idProduto: string,
    nomeProduto: string,
    descricaoProduto: string | null,
    precoProduto: number,
    valorCompra: number,
    tokenCategoria: string,
    tokenFornecedor: string,
    estoqueAtual: number,
    estoqueMinimo: number
  ) {
    setarTokenProduto(idProduto);
    setarNomeProduto(nomeProduto);
    setarDescricaoProduto(descricaoProduto);
    setarPrecoVenda(Number(precoProduto).toFixed(2));
    setarValorCustoProduto(Number(valorCompra).toFixed(2));
    selecionarOpcaoCategoria(tokenCategoria);
    selecionarOpcaoFornecedor(tokenFornecedor);
    setarQtdAtual(estoqueAtual);
    setarQtdMinima(estoqueMinimo);
  }

  function calculaPorcentagemLucroProduto(
    precoVenda: number = 0,
    valorCompra: number = 0
  ): number {
    return (precoVenda > 0 && valorCompra > 0) ? (((precoVenda - valorCompra) / precoVenda) * 100) : 0;
  }

  async function buscaListaProdutos() {
    carregarListaProdutos(true);

    setarListaProdutos(await buscarListaTodosProdutos());

    carregarListaProdutos(false);
  }

  async function buscarListaCodigosBarras(idProduto: string) {
    setarTokenProduto(idProduto);

    carregarListaCodigosBarras(true);

    setarListaCodigoBarras(await buscarListaCodigoBarrasProduto(idProduto));

    carregarListaCodigosBarras(false);
  }

  async function removerCodigoBarrasProduto(
    codigoId: string | null,
    item: number
  ) {
    if (!codigoId) {
      setarListaCodigoBarras([
        ...listaCodigoBarras.slice(0, item),
        ...listaCodigoBarras.slice(item + 1),
      ]);
    } else {
      processarRequisicao(true);

      let status: retornoRequisicaoProps = await deletarCodigoBarrasProduto(
        codigoId
      );

      if (status.status) {
        alertarMensagemSistema("success", status.msg);
      } else {
        alertarMensagemSistema("warning", status.msg);
      }

      processarRequisicao(false);
      if (tokenProduto) buscarListaCodigosBarras(tokenProduto);
    }
  }

  async function adicionarCodigoBarras(cadastrar: boolean = false) {
    if (!codigoBarraProduto) {
      document.getElementById("pcb_codigo")?.focus();
    } else if (cadastrar) {
      processarRequisicao(true);

      if (tokenProduto) {
        let status: retornoRequisicaoProps =
          await adicionarNovoCodigoBarrasProduto(
            tokenProduto,
            codigoBarraProduto
          );

        if (status.status) {
          alertarMensagemSistema("success", status.msg);
        } else {
          alertarMensagemSistema("warning", status.msg);
        }
      }
      processarRequisicao(false);

      if (tokenProduto) buscarListaCodigosBarras(tokenProduto);
    } else {
      setarListaCodigoBarras([
        ...listaCodigoBarras,
        { pcb_codigo: codigoBarraProduto },
      ]);
    }
    setarCodigoBarraProduto(null);
  }

  function limparListaCodigoBarras() {
    setarListaCodigoBarras([]);
  }

  function calculaLucroProduto(
    precoVenda: number = 0,
    valorCompra: number = 0
  ): number {
    if (precoVenda > 0 && valorCompra > 0) {
      return precoVenda - valorCompra;
    } else {
      return 0;
    }
  }

  async function listarFornecedores() {
    carregarFornecedor(true);

    setarListaFornecedor(await buscarListaFornecedores());

    carregarFornecedor(false);
  }

  async function listarCategorias() {
    carregarCategorias(true);

    setarListaCategorias(await buscarListaCategoria());

    carregarCategorias(false);
  }

  useEffect(() => {
    buscaListaProdutos();
    listarCategorias();
    listarFornecedores();
  }, []);

  function limparCamposProdutos() {
    setarTokenProduto(null);
    setarNomeProduto(null);
    setarDescricaoProduto(null);
    setarPrecoVenda("");
    setarValorCustoProduto("");
    setarValorLucroProduto("");
    setarQtdAtual(0);
    setarQtdMinima(0);
    selecionarOpcaoCategoria("");
    selecionarOpcaoFornecedor("");
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();

    let status: retornoRequisicaoProps;

    if (!tokenProduto) {
      processarFormulario(true);

      status = await cadastrarProduto(
        JSON.stringify({
          nomeProduto: nomeProduto,
          precoVendaProduto: precoVendaProduto,
          precoCompraProduto: valorCustoProduto,
          descricaoProduto: descricaoProduto,
          tokenCategoria: categoriaSelecionado,
          tokenFornecedor: fornecedorSelecionado,
          codigoBarrasProduto: listaCodigoBarras,
          estoqueAtualProduto: qtdAtualProduto,
          estoqueMinimoProduto: qtdMinimaProduto,
          margemLucro: porcentagemLucro
        })
      );

      limparListaCodigoBarras();
      processarFormulario(false);
    } else {
      processarRequisicao(true);

      status = await alterarProduto(
        JSON.stringify({
          tokenProduto: tokenProduto,
          nomeProduto: nomeProduto,
          precoVendaProduto: precoVendaProduto,
          precoCompraProduto: valorCustoProduto,
          descricaoProduto: descricaoProduto,
          tokenCategoria: categoriaSelecionado,
          tokenFornecedor: fornecedorSelecionado,
          estoqueAtualProduto: qtdAtualProduto,
          estoqueMinimoProduto: qtdMinimaProduto,
          margemLucro: porcentagemLucro
        })
      );
      processarRequisicao(false);
    }

    if (status.status) {
      alertarMensagemSistema("success", status.msg);
    } else {
      alertarMensagemSistema("warning", status.msg);
    }

    buscaListaProdutos();
    limparCamposProdutos();
  }

  async function ativarProdutoEstoque(pro_id: string) {
    processarRequisicao(true);

    await ativarProduto(pro_id);

    processarRequisicao(false);
    buscaListaProdutos();
  }

  async function desativarProdutoEstoque(pro_id: string) {
    processarRequisicao(true);

    await desativarProduto(pro_id);

    processarRequisicao(false);
    buscaListaProdutos();
  }

  async function buscarListaHistoricoEstoqueProduto(pro_id: string) {
    carregarListaHistoricoProduto(true);

    setarListaHistoricoProduto(await buscarListaHistoricoProduto(pro_id));

    carregarListaHistoricoProduto(false);
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  useEffect(() => {
    setarValorLucroProduto(
      mascaraValorMoedaBrasileira(
        calculaLucroProduto(
          Number(precoVendaProduto),
          Number(valorCustoProduto)
        )
      )
    );

    setarPorcentagemLucroProduto(
      calculaPorcentagemLucroProduto(
        Number(precoVendaProduto),
        Number(valorCustoProduto)
      ).toFixed(2)
    );
  }, [precoVendaProduto, valorCustoProduto]);

  return (
    <>
      <div className="row d-flex justify-content-center mt-3">
        {processandoRequisicao || processandoFormulario ? (
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
        <div className="col-auto">
          <button
            className="btn btn-secondary btn-lg shadow"
            data-bs-toggle="modal"
            data-bs-target="#produtoCadastroModal"
          >
            Cadastrar novo produto
          </button>
        </div>
      </div>
      <hr />
      <div className="row">
        <TabelaProdutos
          listaProdutos={listaProdutos}
          carregandoListaProdutos={carregandoListaProdutos}
          processandoRequisicao={processandoRequisicao}
          editarProduto={(
            idProduto: string,
            nomeProduto: string,
            descricaoProduto: string | null,
            precoProduto: number,
            valorCompra: number,
            tokenCategoria: string,
            tokenFornecedor: string,
            estoqueAtual: number,
            estoqueMinimo: number
          ) => {
            editarProduto(
              idProduto,
              nomeProduto,
              descricaoProduto,
              precoProduto,
              valorCompra,
              tokenCategoria,
              tokenFornecedor,
              estoqueAtual,
              estoqueMinimo
            );
          }}
          ativarProduto={(idProduto) => ativarProdutoEstoque(idProduto)}
          desativarProduto={(idProduto) => desativarProdutoEstoque(idProduto)}
          visualizarCodigosBarrasProduto={(idProduto) =>
            buscarListaCodigosBarras(idProduto)
          }
          visualizarHistoricoEstoqueProduto={(idProduto) => {
            buscarListaHistoricoEstoqueProduto(idProduto);
          }}
        />
      </div>

      {/* <!-- Modal cadastro produtos --> */}
      <div
        className="modal fade"
        id="produtoCadastroModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="produtoCadastroModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="produtoCadastroModalLabel">
                Cadastro de produtos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  limparCamposProdutos();
                  limparListaCodigoBarras();
                }}
                disabled={processandoFormulario}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={salvar}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_nome"
                        id="pro_nome"
                        className="form-control"
                        placeholder="Nome do produto"
                        value={nomeProduto ?? ""}
                        onChange={(event) =>
                          setarNomeProduto(event.target.value)
                        }
                        onCopy={(event) => {
                          setarNomeProduto(event.clipboardData.getData("text"));
                        }}
                        required
                      />
                      <label htmlFor="pro_nome">Nome do produto</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="pro_qtd_atual"
                        id="pro_qtd_atual"
                        className="form-control"
                        placeholder="Qtd. Atual"
                        value={qtdAtualProduto ?? 0}
                        onChange={(event) =>
                          setarQtdAtual(event.target.valueAsNumber)
                        }
                        required
                      />
                      <label htmlFor="pro_qtd_atual">Qtd. Atual</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="pro_qtd_minimo"
                        id="pro_qtd_minimo"
                        min={0}
                        className="form-control"
                        placeholder="Qtd. Mínimo"
                        value={qtdMinimaProduto ?? 0}
                        onChange={(event) => {
                          setarQtdMinima(event.target.valueAsNumber);
                        }}
                        required
                      />
                      <label htmlFor="pro_qtd_minimo">Qtd. Mínimo</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_preco_venda"
                        id="pro_preco_venda"
                        className="form-control"
                        placeholder="Preço de venda"
                        value={precoVendaProduto ?? "0.00"}
                        onChange={(event) => {
                          setarPrecoVenda(
                            formatarValorMoeda(event.target.value)
                          );
                        }}
                        required
                      />
                      <label htmlFor="pro_preco_venda">Preço de venda</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_preco_custo"
                        id="pro_preco_custo"
                        className="form-control"
                        placeholder="Preço de custo"
                        value={valorCustoProduto ?? "0.00"}
                        onChange={(event) => {
                          setarValorCustoProduto(
                            formatarValorMoeda(event.target.value)
                          );
                        }}
                      />
                      <label htmlFor="pro_preco_custo">Preço de custo</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_lucro_produto"
                        id="pro_lucro_produto"
                        className="form-control"
                        placeholder="Lucro produto"
                        value={valorLucro ?? "0.00"}
                        disabled
                      />
                      <label htmlFor="pro_lucro_produto">Lucro (R$)</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_porcentagem_lucro"
                        id="pro_porcentagem_lucro"
                        className="form-control"
                        placeholder="Margem de lucro"
                        value={porcentagemLucro}
                        disabled
                      />
                      <label htmlFor="pro_porcentagem_lucro">
                        Margem de Lucro (%)
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-6 col-md-6 mt-3">
                    <OpcaoCategoria
                      listaCategoria={listaCategorias}
                      carregandoCategorias={carregandoCategorias}
                      nomeSelect="cat_id_produto_estoque"
                      categoriaEscolhida={categoriaSelecionado}
                      selecionarOpcaoCategoria={selecionarOpcaoCategoria}
                    />
                  </div>
                  <div className="col-sm-12 col-lg-6 col-md-6 mt-3">
                    <OpcaoFornecedor
                      listaFornecedor={listaFornecedores}
                      carregandoFornecedores={carregandoFornecedores}
                      nomeSelect="frn_id_produto_estoque"
                      fornecedorSelecionado={fornecedorSelecionado}
                      selecionarOpcaoFornecedor={selecionarOpcaoFornecedor}
                    />
                  </div>
                  <div className="col-12 mb-3 mt-3">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Descrição do produto"
                        id="pro_descricao"
                        style={{ height: "5rem" }}
                        value={descricaoProduto ?? ""}
                        onChange={(event) => {
                          setarDescricaoProduto(event.target.value);
                        }}
                        onCopy={(event) => {
                          setarDescricaoProduto(
                            event.clipboardData.getData("text")
                          );
                        }}
                      ></textarea>
                      <label htmlFor="pro_descricao">Descrição</label>
                    </div>
                  </div>
                  <div className="row align-middle">
                    <div className="col mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          name="pcb_codigo_cadastro_produto"
                          id="pcb_codigo_cadastro_produto"
                          className="form-control"
                          placeholder="Codigo de barras"
                          onChange={(event) =>
                            setarCodigoBarraProduto(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              adicionarCodigoBarras(false);
                              event.preventDefault();
                            }
                          }}
                          value={codigoBarraProduto ?? ""}
                        />
                        <label htmlFor="pcb_codigo_cadastro_produto">
                          Codigo de barras
                        </label>
                      </div>
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-lg btn-success shadow"
                        onClick={() => adicionarCodigoBarras(false)}
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-lg btn-danger shadow"
                        onClick={limparListaCodigoBarras}
                      >
                        Remover todos
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <hr />
                      <TabelaCodigoBarras
                        listaCodigoBarras={listaCodigoBarras}
                        processandoRequisicao={false}
                        buscandoListaCodigoBarras={false}
                        removerCodigoBarras={(id, item) => {
                          removerCodigoBarrasProduto(id, item);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="d-grid gap-2 mx-auto">
                      <button
                        type="submit"
                        id="btnCadastraProduto"
                        className="btn btn-success btn-lg"
                        data-bs-dismiss="modal"
                        disabled={processandoFormulario}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="d-grid gap-2 mx-auto">
                      <button
                        type="button"
                        id="btnCancelaCadastroProduto"
                        className="btn btn-danger btn-lg"
                        onClick={() => {
                          limparCamposProdutos();
                          limparListaCodigoBarras();
                        }}
                        data-bs-dismiss="modal"
                        disabled={processandoFormulario}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal edição de produto ---!> */}
      <div
        className="modal fade"
        id="produtoEdicaoModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="produtoEdicaoModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="produtoEdicaoModalLabel">
                Edição de produtos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={processandoFormulario}
                onClick={limparCamposProdutos}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={salvar}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_nome_edicao"
                        id="pro_nome_edicao"
                        className="form-control"
                        placeholder="Nome do produto"
                        value={nomeProduto ?? ""}
                        onChange={(event) =>
                          setarNomeProduto(event.target.value)
                        }
                        onCopy={(event) => {
                          setarNomeProduto(event.clipboardData.getData("text"));
                        }}
                        required
                      />
                      <label htmlFor="pro_nome_edicao">Nome do produto</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="pro_qtd_atual_edicao"
                        id="pro_qtd_atual_edicao"
                        className="form-control"
                        placeholder="Qtd. Atual"
                        value={qtdAtualProduto ?? 0}
                        onChange={(event) =>
                          setarQtdAtual(event.target.valueAsNumber)
                        }
                        required
                      />
                      <label htmlFor="pro_qtd_atual_edicao">Qtd. Atual</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="pro_qtd_minimo_edicao"
                        id="pro_qtd_minimo_edicao"
                        className="form-control"
                        placeholder="Qtd. Mínimo"
                        min={0}
                        value={qtdMinimaProduto ?? 0}
                        onChange={(event) => {
                          setarQtdMinima(event.target.valueAsNumber);
                        }}
                        required
                      />
                      <label htmlFor="pro_qtd_minimo_edicao">Qtd. Mínimo</label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_preco_venda_edicao"
                        id="pro_preco_venda_edicao"
                        className="form-control"
                        placeholder="Preço de venda"
                        value={precoVendaProduto ?? ""}
                        onChange={(event) => {
                          setarPrecoVenda(
                            formatarValorMoeda(event.target.value)
                          );
                        }}
                        required
                      />
                      <label htmlFor="pro_preco_venda_edicao">
                        Preço de venda
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_preco_custo_edicao"
                        id="pro_preco_custo_edicao"
                        className="form-control"
                        placeholder="Preço de custo"
                        value={valorCustoProduto ?? ""}
                        onChange={(event) => {
                          setarValorCustoProduto(
                            formatarValorMoeda(event.target.value)
                          );
                        }}
                      />
                      <label htmlFor="pro_preco_custo_edicao">
                        Preço de custo
                      </label>
                    </div>
                  </div>

                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_lucro_produto_edicao"
                        id="pro_lucro_produto_edicao"
                        className="form-control"
                        placeholder="Lucro produto"
                        value={valorLucro}
                        disabled
                      />
                      <label htmlFor="pro_lucro_produto_edicao">
                        Lucro produto
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2 col-lg-2 col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="pro_porcentagem_lucro_edicao"
                        id="pro_porcentagem_lucro_edicao"
                        className="form-control"
                        placeholder="Margem de lucro"
                        value={porcentagemLucro}
                        disabled
                      />
                      <label htmlFor="pro_porcentagem_lucro_edicao">
                        Margem de lucro (%)
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-6 col-md-6 mt-3">
                    <OpcaoCategoria
                      listaCategoria={listaCategorias}
                      carregandoCategorias={carregandoCategorias}
                      nomeSelect="cat_id_produto_estoque_edicao"
                      categoriaEscolhida={categoriaSelecionado}
                      selecionarOpcaoCategoria={selecionarOpcaoCategoria}
                    />
                  </div>
                  <div className="col-sm-12 col-lg-6 col-md-6 mt-3">
                    <OpcaoFornecedor
                      listaFornecedor={listaFornecedores}
                      carregandoFornecedores={carregandoFornecedores}
                      nomeSelect="frn_id_produto_estoque_edicao"
                      fornecedorSelecionado={fornecedorSelecionado}
                      selecionarOpcaoFornecedor={selecionarOpcaoFornecedor}
                    />
                  </div>
                  <div className="col-12 mb-3 mt-3">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Descrição do produto"
                        id="pro_descricao_edicao"
                        style={{ height: "5rem" }}
                        value={descricaoProduto ?? ""}
                        onChange={(event) => {
                          setarDescricaoProduto(event.target.value);
                        }}
                        onCopy={(event) => {
                          setarDescricaoProduto(
                            event.clipboardData.getData("text")
                          );
                        }}
                      ></textarea>
                      <label htmlFor="pro_descricao_edicao">Descrição</label>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="d-grid gap-2 mx-auto">
                      <button
                        type="submit"
                        id="btnEdicaoProduto"
                        className="btn btn-success btn-lg"
                        data-bs-dismiss="modal"
                        disabled={processandoFormulario}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="d-grid gap-2 mx-auto">
                      <button
                        type="button"
                        id="btnCancelaEdicaoProduto"
                        className="btn btn-danger btn-lg"
                        onClick={limparCamposProdutos}
                        data-bs-dismiss="modal"
                        disabled={processandoFormulario}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal edição dos codigos de barras produto ---!> */}
      <div
        className="modal fade"
        id="codigoBarrasProdutoEdicaoModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="codigoBarrasProdutoEdicaoModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="codigoBarrasProdutoEdicaoModalLabel"
              >
                Codigo de barras produtos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={processandoRequisicao || carregandoListaCodigosBarras}
                onClick={() => {
                  limparCamposProdutos();
                  limparListaCodigoBarras();
                }}
              ></button>
            </div>
            <div className="modal-body">
              {processandoRequisicao ? (
                <div className="row align-middle mb-3 mt-0">
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
              <div className="row align-middle">
                <div className="col mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      name="pcb_codigo_cadastro_produto"
                      id="pcb_codigo_cadastro_produto"
                      className="form-control"
                      placeholder="Codigo de barras"
                      disabled={processandoRequisicao}
                      onChange={(event) =>
                        setarCodigoBarraProduto(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          adicionarCodigoBarras(true);
                          event.preventDefault();
                        }
                      }}
                      value={codigoBarraProduto ?? ""}
                    />
                    <label htmlFor="pcb_codigo_cadastro_produto">
                      Codigo de barras
                    </label>
                  </div>
                </div>
                <div className="col-auto mx-1">
                  <button
                    type="button"
                    disabled={processandoRequisicao}
                    className="btn btn-lg btn-success shadow"
                    onClick={() => adicionarCodigoBarras(true)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr />
                  <TabelaCodigoBarras
                    listaCodigoBarras={listaCodigoBarras}
                    processandoRequisicao={processandoRequisicao}
                    buscandoListaCodigoBarras={carregandoListaCodigosBarras}
                    removerCodigoBarras={(id, item) => {
                      removerCodigoBarrasProduto(id, item);
                    }}
                  />
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12 col-md-2 col-lg-2">
                  <div className="d-grid gap-2 mx-auto">
                    <button
                      type="button"
                      id="btnCancelaEdicaoProduto"
                      className="btn btn-danger btn-lg"
                      onClick={() => {
                        limparCamposProdutos();
                        limparListaCodigoBarras();
                      }}
                      data-bs-dismiss="modal"
                      disabled={
                        processandoRequisicao || carregandoListaCodigosBarras
                      }
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="historicoProdutoModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="historicoProdutoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="historicoProdutoModalLabel">
                Historico de movimentações estoque
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setarListaHistoricoProduto([]);
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TabelaHistoricoEstoqueProduto
                listaHistoricoProduto={listaHistoricoProduto}
                carregandoListaHistorico={carregandoListaHistorico}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
