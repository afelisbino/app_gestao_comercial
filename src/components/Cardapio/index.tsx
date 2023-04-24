import { FormEvent, useEffect, useState } from "react";
import { OpcaoCategoria } from "../Categorias/OpcaoCategoria";
import instanciaAxios from "../../libraries/AxiosInstance";
import { cardapioProps } from "../../interfaces/interfaceCardapio";
import { TabelaCardapio } from "./TabelaCardapio";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { Spinner } from "../Loaders/Spinner";
import { Alerta } from "../Alerta";
import { formataValorMoedaBrasileira } from "../../controllers/NumeroController";
import { buscarListaCategoria } from "../../controllers/CategoriaController";
import { categoriaProps } from "../../interfaces/interfaceCategoria";

export function Cardapio() {
  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [tokenProduto, setarTokenProduto] = useState<string | null>(null);
  const [categoriaSelecionado, selecionarOpcaoCategoria] = useState<string>("");
  const [nomeProduto, setarNomeProduto] = useState<string>("");
  const [valorProduto, setarValorProduto] = useState<string>("");
  const [descricaoProduto, setarDescricaoProduto] = useState<string | null>(
    null
  );

  const [carregandoCardapio, processarListaCardapio] = useState(false);
  const [listaProdutoCardapio, setarListaProdutoCardapio] = useState<
    cardapioProps[]
  >([]);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");
  const [listaCategorias, setarListaCategorias] = useState<categoriaProps[]>(
    []
  );
  const [carregandoCategorias, carregarCategorias] = useState(false);

  function limparCampos() {
    selecionarOpcaoCategoria("");
    setarNomeProduto("");
    setarValorProduto("");
    setarDescricaoProduto("");
    setarTokenProduto(null);
  }

  async function listarProdutosCardapio() {
    processarListaCardapio(true);
    await instanciaAxios
      .get<cardapioProps[]>("cardapio/listar/todos")
      .then(({ data }) => {
        setarListaProdutoCardapio(data);
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.error(error);
      })
      .finally(() => processarListaCardapio(false));
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function editarProduto(
    id: string,
    nome: string,
    valor: number,
    idCategoria: string,
    descricao: string | null
  ) {
    selecionarOpcaoCategoria(idCategoria);
    setarNomeProduto(nome);
    setarValorProduto(valor.toString());
    setarDescricaoProduto(descricao);
    setarTokenProduto(id);
  }

  async function alterarStatusProduto(id: string, disponibilidade: boolean) {
    if (disponibilidade) {
      ativarProduto(id);
    } else {
      desativarProduto(id);
    }
  }

  async function desativarProduto(id: string) {
    processarRequisicao(true);
    await instanciaAxios
      .patch<retornoRequisicaoProps>(
        "cardapio/desativar",
        {
          tokenProduto: id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
        } else {
          alertarMensagemSistema("warning", data.msg);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.error(error);
      })
      .finally(() => {
        processarRequisicao(false);
        listarProdutosCardapio();
        limparCampos();
      });
  }

  async function ativarProduto(id: string) {
    processarRequisicao(true);
    await instanciaAxios
      .patch<retornoRequisicaoProps>(
        "cardapio/ativar",
        {
          tokenProduto: id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
        } else {
          alertarMensagemSistema("warning", data.msg);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.error(error);
      })
      .finally(() => {
        processarRequisicao(false);
        listarProdutosCardapio();
        limparCampos();
      });
  }

  async function salvarProdutoCardapio(event: FormEvent) {
    event.preventDefault();

    if (!categoriaSelecionado) {
      alertarMensagemSistema(
        "warning",
        "Precisa selecionar uma categoria para prosseguir!"
      );

      document.getElementById("cat_id_produto")?.focus();
      return;
    }

    processarFormulario(true);
    if (tokenProduto) {
      alterar();
    } else {
      cadastrar();
    }
  }

  async function cadastrar() {
    await instanciaAxios
      .post<retornoRequisicaoProps>("cardapio/cadastrar", {
        nomeProduto: nomeProduto,
        valorProduto: parseFloat(valorProduto),
        descricaoProduto: descricaoProduto,
        tokenCategoria: categoriaSelecionado,
      })
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
        } else {
          alertarMensagemSistema("warning", data.msg);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.error(error);
      })
      .finally(() => {
        processarFormulario(false);
        listarProdutosCardapio();
        limparCampos();
      });
  }

  async function alterar() {
    await instanciaAxios
      .put<retornoRequisicaoProps>(
        "cardapio/alterar",
        {
          tokenProduto: tokenProduto,
          nomeProduto: nomeProduto,
          valorProduto: parseFloat(valorProduto),
          descricaoProduto: descricaoProduto,
          tokenCategoria: categoriaSelecionado,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
        } else {
          alertarMensagemSistema("warning", data.msg);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.error(error);
      })
      .finally(() => {
        processarFormulario(false);
        listarProdutosCardapio();
        limparCampos();
      });
  }

  async function listarCategorias() {
    carregarCategorias(true);

    setarListaCategorias(await buscarListaCategoria());

    carregarCategorias(false);
  }

  useEffect(() => {
    listarProdutosCardapio();
    listarCategorias();
  }, []);

  return (
    <>
      {processandoRequisicao ? (
        <div className="row">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      <form className="mt-5" onSubmit={salvarProdutoCardapio}>
        {mensagemAlerta !== null ? (
          <div className="row">
            <div className="col-12">
              <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="row gap-0">
          <div className="col-md-8 col-lg-8 col-sm-12">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="cdp_nome"
                id="cdp_nome"
                className="form-control"
                placeholder="Nome do produto"
                value={nomeProduto ?? ""}
                onChange={(event) => setarNomeProduto(event.target.value)}
                onCopy={(event) => {
                  setarNomeProduto(event.clipboardData.getData("text"));
                }}
                required
              />
              <label htmlFor="cdp_nome">Nome do produto</label>
            </div>
          </div>
          <div className="col-md-4 col-lg-4 col-sm-12">
            <div className="form-floating mb-3">
              <input
                type="text"
                name="cdp_valor"
                id="cdp_valor"
                className="form-control"
                value={valorProduto ?? ""}
                placeholder="Valor"
                // onChange={(event) =>
                //   setarValorProduto(
                //     mascaraValorMoedaBrasileira(event.target.value)
                //   )
                // }
                // onCopy={(event) => {
                //   setarValorProduto(
                //     mascaraValorMoedaBrasileira(
                //       event.clipboardData.getData("text")
                //     )
                //   );
                // }}
                required
              />
              <label htmlFor="cdp_valor">Valor do produto</label>
            </div>
          </div>
          <div className="col-12 mb-3">
            <OpcaoCategoria
              listaCategoria={listaCategorias}
              carregandoCategorias={carregandoCategorias}
              nomeSelect="cat_id_produto"
              categoriaEscolhida={categoriaSelecionado}
              selecionarOpcaoCategoria={selecionarOpcaoCategoria}
            />
          </div>
          <div className="col-12 mb-3">
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Descrição do produto"
                id="cdp_descricao"
                style={{ height: "100px" }}
                value={descricaoProduto ?? ""}
                onChange={(event) => setarDescricaoProduto(event.target.value)}
                onCopy={(event) =>
                  setarDescricaoProduto(event.clipboardData.getData("string"))
                }
              ></textarea>
              <label htmlFor="cdp_descricao">Descrição</label>
            </div>
          </div>
        </div>
        <div className="row gap-2">
          <div className="col-sm-12 col-md-2 col-lg-2">
            <div className="d-grid gap-2 mx-auto">
              {processandoFormulario ? (
                <button
                  className="btn btn-success btn-lg shadow"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Salvando...
                </button>
              ) : (
                <button type="submit" className="btn btn-success btn-lg shadow">
                  Salvar
                </button>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-2 col-lg-2">
            <div className="d-grid gap-2 mx-auto">
              <button
                type="button"
                className="btn btn-danger btn-lg shadow"
                disabled={processandoFormulario}
                onClick={() => limparCampos()}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
      <hr />
      <TabelaCardapio
        editar={(id, nome, valor, categoria, descricao) =>
          editarProduto(id, nome, valor, categoria, descricao)
        }
        mudarStatus={(id, status) => alterarStatusProduto(id, status)}
        processandoRequisicao={processandoRequisicao}
        carregandoCardapio={carregandoCardapio}
        listarCardapio={listaProdutoCardapio}
      />
    </>
  );
}
