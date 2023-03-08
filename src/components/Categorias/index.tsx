import { FormEvent, useEffect, useState } from "react";
import { TabelaCategoria } from "./TabelaCategoria";
import instanciaAxios from "../../libraries/AxiosInstance";
import { categoriaProps } from "../../interfaces/interfaceCategoria";
import { Alerta } from "../Alerta";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { Spinner } from "../Loaders/Spinner";

export function Categorias() {
  const [carregandoCategorias, carregarCategorias] = useState(false);
  const [listaCategoria, carregarListaCategoria] = useState<categoriaProps[]>(
    []
  );
  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");
  const [nomeCategoria, setarNomeCategoria] = useState<string>("");
  const [tokenCategoria, setarTokenCategoria] = useState<string | null>(null);

  async function buscarListaCategoria() {
    carregarCategorias(true);

    await instanciaAxios
      .get<categoriaProps[]>("categoria/listar")
      .then(({ data }) => {
        carregarListaCategoria(data);
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.log(error);
      })
      .finally(() => {
        carregarCategorias(false);
      });
  }

  function editarCategoria(cat_id: string, cat_nome: string) {
    setarNomeCategoria(cat_nome);
    setarTokenCategoria(cat_id);
  }

  async function excluirCategoria(cat_id: string) {
    processarRequisicao(true);

    await instanciaAxios
      .delete<retornoRequisicaoProps>("categoria/excluir", {
        data: {
          tokenCategoria: cat_id,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
          buscarListaCategoria();
        } else {
          alertarMensagemSistema("warning", data.msg);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "warning",
          "Erro durante processamento, tente novamente!"
        );
        console.log(error);
      })
      .finally(() => {
        processarRequisicao(false);
      });
  }

  async function salvarCategoria(event: FormEvent) {
    event.preventDefault();
    processarFormulario(true);

    if (tokenCategoria != null) {
      alterarCategoria();
    } else {
      cadastrarCategoria();
    }
  }

  async function alterarCategoria() {
    await instanciaAxios
      .patch<retornoRequisicaoProps>(
        "categoria/editar",
        {
          tokenCategoria: tokenCategoria,
          nomeCategoria: nomeCategoria,
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
          "danger",
          "Erro durante processamento, tente novamente!"
        );
        console.log(error);
      })
      .finally(() => {
        limparCampos();
        processarFormulario(false);
        buscarListaCategoria();
        setarTokenCategoria(null);
      });
  }

  async function cadastrarCategoria() {
    await instanciaAxios
      .post<retornoRequisicaoProps>("categoria/cadastrar", {
        nomeCategoria: nomeCategoria,
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
          "danger",
          "Erro durante processamento, tente novamente!"
        );
        console.log(error);
      })
      .finally(() => {
        limparCampos();
        processarFormulario(false);
        buscarListaCategoria();
      });
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function limparCampos() {
    setarNomeCategoria("");
    setarTokenCategoria(null);
  }

  useEffect(() => {
    buscarListaCategoria();
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
      <div className="row mt-5">
        <form onSubmit={salvarCategoria}>
          {mensagemAlerta !== null ? (
            <div className="row">
              <div className="col-12">
                <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="cat_nome"
                  placeholder="Categoria"
                  disabled={processandoFormulario}
                  required
                  value={nomeCategoria ?? ""}
                  onChange={(event) => {
                    setarNomeCategoria(event.target.value);
                  }}
                />
                <label htmlFor="cat_nome">Categoria</label>
              </div>
            </div>
          </div>
          <div className="row">
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
                  <button
                    type="submit"
                    className="btn btn-success btn-lg shadow"
                  >
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
                  onClick={limparCampos}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          <TabelaCategoria
            listarCategoria={listaCategoria}
            carregandoCategoria={carregandoCategorias}
            processandoRequisicao={processandoRequisicao}
            editar={(id, nome) => editarCategoria(id, nome)}
            excluir={(id) => excluirCategoria(id)}
          />
        </div>
      </div>
    </>
  );
}
