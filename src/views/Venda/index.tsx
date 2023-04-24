import { useEffect, useRef, useState } from "react";
import { ListaProdutos } from "../../components/Vendas/ListaProdutos";
import { produtoAtivosProps } from "../../interfaces/interfaceProdutosAtivos";
import { buscarListaProdutoAtivo } from "../../controllers/ProdutoController";
import { Sacola } from "../../components/Vendas/Sacola";
import { itemSacolaProp } from "../../interfaces/interfaceSacola";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { NumericFormat } from "react-number-format";
import {
  finalizarVendaLocalFiado,
  finalizarVendaLocalNormal,
  tiposPagamentos,
} from "../../controllers/VendaController";
import { formataValorMoedaBrasileira } from "../../controllers/NumeroController";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";

const Venda = () => {
  const [carregandoProdutos, carregarProdutos] = useState(false);
  const [processandoVenda, processarVenda] = useState(false);
  const [vendaFiado, setarVendaFiado] = useState(false);

  const [listaProduto, setarListaProduto] = useState<produtoAtivosProps[]>([]);
  const [itensSacola, setarItensSacola] = useState<itemSacolaProp[]>([]);

  const [valorPago, setarValorPago] = useState<number>(0);
  const [valorDesconto, setarValorDesconto] = useState<number>(0);
  const [tipoPagamento, selecionarTipoPagamento] = useState<string>("");
  const [nomeClienteFiado, setarNomeClienteFiado] = useState<string | null>(
    null
  );

  const [quantidadeItem, setarQuantidadeItemSacola] = useState<number>(1);
  const [filtroProduto, setarFiltro] = useState<string>("");

  const quantidadeItemRef = useRef<HTMLInputElement>(null);
  const filtroProdutoRef = useRef<HTMLInputElement>(null);
  const tipoPagamentoRef = useRef<HTMLSelectElement>(null);
  const nomeClienteFiadoRef = useRef<HTMLInputElement>(null);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const regexNumero = new RegExp("^[0-9]+$");

  const listaProdutosEmpresa =
    filtroProduto.length === 0
      ? listaProduto
      : regexNumero.test(filtroProduto)
      ? filtraProdutoCodigoBarras(filtroProduto)
      : filtraProdutoNome(filtroProduto);

  const totalCompra: number = itensSacola.reduce(
    (total: number, produto: itemSacolaProp) => {
      return (total += produto.scl_sub_total);
    },
    0
  );

  const totalCompraComDesconto: number =
    valorDesconto > 0 ? totalCompra - valorDesconto : 0;

  const valorTrocoCompra: number =
    valorPago > 0
      ? totalCompraComDesconto > 0 && valorPago > totalCompraComDesconto
        ? valorPago - totalCompraComDesconto
        : valorPago > totalCompra
        ? valorPago - totalCompra
        : 0
      : 0;

  function limpaCampos() {
    setarItensSacola([]);
    setarValorDesconto(0);
    setarValorPago(0);
    setarVendaFiado(false);
    setarNomeClienteFiado(null);
    setarQuantidadeItemSacola(1);
    selecionarTipoPagamento("");
  }

  function filtraProdutoNome(filtro: string): produtoAtivosProps[] {
    return listaProduto.filter((produto) =>
      produto.pro_nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  function filtraProdutoCodigoBarras(
    filtro: string
  ): Array<produtoAtivosProps> {
    let produtoCodigoBarras = listaProduto.find((produto: produtoAtivosProps) =>
      produto.pro_codigos.some(
        (codigoBarras) => codigoBarras.pcb_codigo === filtro
      )
    );

    if (produtoCodigoBarras)
      adicionaItemSacola(
        produtoCodigoBarras?.est_qtd_atual,
        produtoCodigoBarras?.pro_id,
        produtoCodigoBarras?.pro_nome,
        produtoCodigoBarras?.pro_valor
      );

    return [];
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function verificaDisponibilidadeProdutoEstoque(
    qtdAtualEstoque: number,
    tokenProduto: string
  ): boolean {
    let somaItensProdutoAdicionado = itensSacola.reduce(
      (somatoriaQtd, produto) => {
        if (produto.pro_id === tokenProduto)
          return somatoriaQtd + produto.scl_qtd;

        return 0;
      },
      0
    );

    return somaItensProdutoAdicionado >= qtdAtualEstoque;
  }

  function excluirItem(id: string) {
    setarItensSacola(itensSacola.filter((item) => item.id !== id));
    filtroProdutoRef.current?.focus();
  }

  function adicionaItemSacola(
    qtdAtualEstoque: number,
    idProduto: string,
    nomeProduto: string,
    valorProduto: number
  ) {
    if (verificaDisponibilidadeProdutoEstoque(qtdAtualEstoque, idProduto)) {
      alertarMensagemSistema(
        "warning",
        "Não possuímos essa quantidade de produto no estoque!"
      );
    } else if (quantidadeItem > qtdAtualEstoque) {
      alertarMensagemSistema(
        "warning",
        "Não possuímos essa quantidade de produto no estoque!"
      );
    } else if (isNaN(quantidadeItem) || quantidadeItem == 0) {
      quantidadeItemRef?.current?.classList.add("border-danger");
      alertarMensagemSistema(
        "warning",
        "A quantidade do item não pode ser em branco ou zerado!"
      );
    } else {
      quantidadeItemRef?.current?.classList.remove("border-danger");
      setarItensSacola(
        [
          ...itensSacola,
          {
            id: self.crypto.randomUUID(),
            pro_id: idProduto,
            scl_qtd: quantidadeItem,
            scl_sub_total: valorProduto * quantidadeItem,
            pro_nome: nomeProduto,
          },
        ].reverse()
      );

      setarFiltro("");
      setarQuantidadeItemSacola(1);
      filtroProdutoRef.current?.focus();
    }
  }

  async function buscaListaProdutoAtivos() {
    carregarProdutos(true);

    setarListaProduto(await buscarListaProdutoAtivo());

    carregarProdutos(false);
    filtroProdutoRef.current?.focus();
  }

  async function registraVendaNormal(): Promise<retornoRequisicaoProps> {
    if (tipoPagamento !== "") {
      if (tipoPagamentoRef.current?.classList.contains("border-danger"))
        tipoPagamentoRef.current?.classList.remove("border-danger");

      return await finalizarVendaLocalNormal(
        totalCompra,
        valorDesconto,
        itensSacola,
        tipoPagamento
      );
    }

    tipoPagamentoRef.current?.classList.add("border-danger");

    return {
      status: false,
      msg: "Tipo de pagamento não informado",
    };
  }

  async function registraVendaFiado(): Promise<retornoRequisicaoProps> {
    if (nomeClienteFiado !== null || nomeClienteFiado !== "") {
      if (nomeClienteFiadoRef.current?.classList.contains("border-danger"))
        nomeClienteFiadoRef.current?.classList.remove("border-danger");

      return await finalizarVendaLocalFiado(
        totalCompra,
        nomeClienteFiado ?? "",
        itensSacola
      );
    }

    nomeClienteFiadoRef.current?.classList.add("border-danger");

    return {
      status: false,
      msg: "Nome do cliente não informado",
    };
  }

  async function registraVenda() {
    processarVenda(true);

    let statusRegistro = vendaFiado
      ? await registraVendaFiado()
      : await registraVendaNormal();

    alertarMensagemSistema(
      statusRegistro.status ? "success" : "warning",
      statusRegistro.msg
    );

    processarVenda(false);

    if (statusRegistro.status) {
      limpaCampos();
      filtroProdutoRef.current?.focus();
    }
  }

  useEffect(() => {
    buscaListaProdutoAtivos();
  }, []);

  return (
    <>
      {processandoVenda ? (
        <div className="row mb-3 mt-0">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      {mensagemAlerta !== null ? (
        <div className="row ">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="row align-middle gap-2 gap-lg-0 overflow-hidden">
        <div className="col-12 col-md-2 col-lg-4">
          <div className="form-floating">
            <NumericFormat
              className="form-control"
              displayType="input"
              decimalSeparator={","}
              thousandSeparator={"."}
              allowLeadingZeros={true}
              decimalScale={2}
              fixedDecimalScale
              getInputRef={quantidadeItemRef}
              disabled={carregandoProdutos}
              allowNegative={false}
              value={quantidadeItem}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  filtroProdutoRef.current?.focus();
                }
              }}
              onValueChange={(value) => {
                setarQuantidadeItemSacola(parseFloat(value.value) ?? 0);
              }}
            />
            <label htmlFor="qtdAdicionarProduto">Quantidade de itens</label>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <div className="form-floating">
            <input
              type="text"
              disabled={carregandoProdutos}
              ref={filtroProdutoRef}
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
        <div className="col-12 col-lg-2 col-md-4 d-grid">
          <button
            key={self.crypto.randomUUID()}
            type="button"
            className="btn btn-success btn-lg shadow"
            disabled={itensSacola.length === 0}
            data-bs-toggle="modal"
            data-bs-target="#finalizaVenda"
          >
            Finalizar
          </button>
        </div>
      </div>
      <div className="row row-cols-auto row-cols-md-2 row-cols-lg-2">
        <div className="col-12 col-md-7 col-lg-8 col-xl-9 mt-4">
          <ListaProdutos
            carregandoProdutos={carregandoProdutos}
            processandoVenda={false}
            listaProdutos={listaProdutosEmpresa}
            adicionarItemSacola={adicionaItemSacola}
          />
        </div>
        <div className="col-12 col-md-4 col-lg-4 col-xl-3 mt-4">
          <Sacola
            itensSacola={itensSacola}
            processandoVenda={false}
            excluirItemSacola={excluirItem}
          />
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
                  >
                    {"Total " +
                      (totalCompraComDesconto > 0
                        ? formataValorMoedaBrasileira(totalCompraComDesconto)
                        : formataValorMoedaBrasileira(totalCompra))}
                  </h1>
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
                              ref={tipoPagamentoRef}
                              id="tipoPagamento"
                              value={tipoPagamento}
                              onChange={(event) => {
                                selecionarTipoPagamento(event.target.value);
                              }}
                              aria-label="Tipo de pagamento"
                            >
                              <option
                                key={self.crypto.randomUUID()}
                                disabled
                                value={""}
                              >
                                Selecione
                              </option>
                              {tiposPagamentos.map((tipo) => {
                                return (
                                  <option
                                    key={self.crypto.randomUUID()}
                                    value={tipo.valor}
                                  >
                                    {tipo.nome}
                                  </option>
                                );
                              })}
                            </select>
                            <label htmlFor="tipoPagamento">
                              Tipo de pagamento
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-lg-6 col-md-6">
                          <div className="form-floating mb-3">
                            <NumericFormat
                              className="form-control"
                              displayType="input"
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              allowLeadingZeros={true}
                              decimalScale={2}
                              fixedDecimalScale
                              allowNegative={false}
                              value={valorDesconto}
                              onValueChange={(value) => {
                                setarValorDesconto(
                                  parseFloat(value.value) ?? 0
                                );
                              }}
                            />
                            <label htmlFor="descontoVenda">Desconto</label>
                          </div>
                        </div>
                        <div className="col-sm-12 col-lg-6 col-md-6">
                          <div className="form-floating mb-3">
                            <NumericFormat
                              className="form-control"
                              displayType="input"
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              allowLeadingZeros={true}
                              decimalScale={2}
                              fixedDecimalScale
                              allowNegative={false}
                              value={valorPago}
                              onValueChange={(value) => {
                                setarValorPago(parseFloat(value.value) ?? 0);
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
                            {"Troco: " +
                              formataValorMoedaBrasileira(valorTrocoCompra)}
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
                              ref={nomeClienteFiadoRef}
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
                onClick={registraVenda}
                disabled={processandoVenda}
                data-bs-dismiss="modal"
              >
                Registrar venda
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Venda;
