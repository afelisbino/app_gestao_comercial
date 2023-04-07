import { FormEvent, useEffect, useState } from "react";
import { categoriaProps } from "../../interfaces/interfaceCategoria";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { TabelaCategoria } from "../../components/Categorias/TabelaCategoria";
import {
  atualizarCategoria,
  buscarListaCategoria,
  cadastrarCategoria,
} from "../../controllers/CategoriaController";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";

const Categoria = () => {
  const [carregandoCategorias, carregarCategorias] = useState(false);
  const [listaCategoria, setarListaCategoria] = useState<categoriaProps[]>([]);
  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");
  const [nomeCategoria, setarNomeCategoria] = useState<string>("");
  const [tokenCategoria, setarTokenCategoria] = useState<string | null>(null);

  const editarCategoria = (cat_id: string, cat_nome: string) => {
    setarNomeCategoria(cat_nome);
    setarTokenCategoria(cat_id);
  };

  async function listarCategoriaEmpresa() {
    carregarCategorias(true);
    setarListaCategoria(await buscarListaCategoria());
    carregarCategorias(false);
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

  const salvar = async (event: FormEvent) => {
    event.preventDefault();

    processarFormulario(true);

    const status: retornoRequisicaoProps = tokenCategoria
      ? await atualizarCategoria(nomeCategoria, tokenCategoria)
      : await cadastrarCategoria(nomeCategoria);

    alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    limparCampos();
    processarFormulario(false);
    listarCategoriaEmpresa();
  };

  useEffect(() => {
    listarCategoriaEmpresa();
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
        <form onSubmit={salvar}>
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
          />
        </div>
      </div>
    </>
  );
};

export default Categoria;
