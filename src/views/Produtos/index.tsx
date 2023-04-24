import { useEffect, useState } from "react";
import { TabelaProdutos } from "../../components/Estoque/TabelaProdutos";
import { produtoProps } from "../../interfaces/interfaceProdutos";
import {
  adicionarNovoCodigoBarrasProduto,
  ativarProduto,
  buscarListaCodigoBarrasProduto,
  buscarListaHistoricoProduto,
  buscarListaTodosProdutos,
  deletarCodigoBarrasProduto,
  desativarProduto,
} from "../../controllers/ProdutoController";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { codigoBarrasProps } from "../../interfaces/interfaceCodigoBarrasProduto";
import { historicoProdutoEstoqueProps } from "../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { TabelaCodigoBarras } from "../../components/Estoque/TabelaCodigoBarras";
import { TabelaHistoricoEstoqueProduto } from "../../components/Estoque/TabelaHistoricoEstoqueProduto";
import { FormularioProduto } from "../../components/Estoque/FormularioProduto";
import { FormularioCodigoBarras } from "../../components/Estoque/FormularioCodigoBarras";

const Produtos = () => {
  const [listaProdutos, setarListaProdutos] = useState<produtoProps[]>([]);
  const [listaHistoricoProduto, setarListaHistoricoProduto] = useState<
    historicoProdutoEstoqueProps[]
  >([]);
  const [listaCodigoBarras, setarListaCodigoBarras] = useState<
    codigoBarrasProps[]
  >([]);

  const [tokenProduto, setarTokenProduto] = useState<string | null>(null);

  const [carregandoListaProdutos, carregarListaProdutos] = useState(false);
  const [carregandoListaHistorico, carregarListaHistoricoProduto] =
    useState(false);
  const [carregandoListaCodigosBarras, carregarListaCodigosBarras] =
    useState(false);

  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [dadosProduto, setarDadosProduto] = useState<produtoProps | null>(null);

  document
    .querySelector("#produtoModal")
    ?.addEventListener("hidden.bs.modal", (event) => {
      setarDadosProduto(null);
    });

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
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

  async function removerCodigoBarrasProduto(codigoId: string) {
    processarRequisicao(true);

    const status: retornoRequisicaoProps = await deletarCodigoBarrasProduto(
      codigoId
    );

    alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    processarRequisicao(false);

    if (tokenProduto) buscarListaCodigosBarras(tokenProduto);
  }

  async function adicionarCodigoBarras(codigoBarraProduto: string) {
    if (tokenProduto) {
      processarRequisicao(true);

      const status: retornoRequisicaoProps =
        await adicionarNovoCodigoBarrasProduto(
          tokenProduto,
          codigoBarraProduto
        );

      processarRequisicao(false);
      alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
      buscarListaCodigosBarras(tokenProduto);
    }
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

  useEffect(() => {
    buscaListaProdutos();
  }, []);

  return (
    <>
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
      <div className="d-flex justify-content-center justify-content-lg-start">
        <button
          className="btn btn-success btn-lg shadow"
          data-bs-toggle="modal"
          data-bs-target="#produtoModal"
        >
          Novo produto
        </button>
      </div>
      <hr />
      <TabelaProdutos
        listaProdutos={listaProdutos}
        carregandoListaProdutos={carregandoListaProdutos}
        processandoRequisicao={processandoRequisicao}
        editarProduto={(idProduto) => {
          setarDadosProduto(
            listaProdutos.find((produto) => produto.pro_id === idProduto) ??
              null
          );
        }}
        ativarProduto={ativarProdutoEstoque}
        desativarProduto={desativarProdutoEstoque}
        visualizarCodigosBarrasProduto={buscarListaCodigosBarras}
        visualizarHistoricoEstoqueProduto={buscarListaHistoricoEstoqueProduto}
      />

      {/* <!-- Modal edição produtos --> */}
      <div
        className="modal fade"
        id="produtoModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="produtoModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="produtoCadastroModalLabel">
                {dadosProduto?.pro_id
                  ? "Alterar dados do " + dadosProduto.pro_nome
                  : "Cadastrar novo produto"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={processandoFormulario}
              ></button>
            </div>
            <div className="modal-body">
              <FormularioProduto
                dadosProduto={dadosProduto}
                alertarMensagem={alertarMensagemSistema}
                processandoFormulario={processarFormulario}
                atualizarListaProdutos={() => buscaListaProdutos()}
              />
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => setarListaCodigoBarras([])}
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

              <FormularioCodigoBarras
                cadastroProduto={false}
                cadastrandoCodigo={processandoRequisicao}
                limparListaCodigoBarras={() => setarListaCodigoBarras([])}
                adicionaCodigoBarras={adicionarCodigoBarras}
              />
              <div className="row mt-3">
                <div className="col-12">
                  <TabelaCodigoBarras
                    listaCodigoBarras={listaCodigoBarras}
                    processandoRequisicao={processandoRequisicao}
                    buscandoListaCodigoBarras={carregandoListaCodigosBarras}
                    removerCodigoBarras={(id, item) => {
                      removerCodigoBarrasProduto(id ?? "");
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
                      onClick={() => setarListaCodigoBarras([])}
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
};

export default Produtos;
