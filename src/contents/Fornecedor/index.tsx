import { FormEvent, useEffect, useState } from "react";
import { fornecedorProps } from "../../interfaces/interfaceFornecedor";
import { TabelaFornecedor } from "../../components/Fornecedores/TabelaFornecedor";
import {
  mascararCnpj,
  validaCNPJ,
} from "../../controllers/DocumentoController";
import { Alerta } from "../../components/Alerta";
import { Spinner } from "../../components/Loaders/Spinner";
import {
  atualizaDadosFornecedor,
  buscaDadosFornecedor,
  buscarListaFornecedores,
  cadastraFornecedor,
} from "../../controllers/FornecedorController";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";

const Fornecedor = () => {
  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [carregandoFornecedor, carregarFornecedores] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [nomeFornecedor, setarNomeFornecedor] = useState<string>("");
  const [documentoFornecedor, setarDocumentoFornecedor] = useState<
    string | null
  >(null);
  const [tokenFornecedor, setarTokenFornecedor] = useState<string | null>(null);

  const [listaFornecedores, setarListaFornecedores] = useState<
    fornecedorProps[]
  >([]);

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function limparCampos() {
    setarTokenFornecedor(null);
    setarNomeFornecedor("");
    setarDocumentoFornecedor(null);
  }

  async function listarFornecedores() {
    processarRequisicao(true);

    setarListaFornecedores(await buscarListaFornecedores());

    processarRequisicao(false);
  }

  async function editarFornecedor(idFornecedor: string) {
    carregarFornecedores(true);

    const dadosFornecedor = await buscaDadosFornecedor(idFornecedor);

    setarTokenFornecedor(idFornecedor);
    setarNomeFornecedor(dadosFornecedor.frn_nome);
    setarDocumentoFornecedor(dadosFornecedor.frn_doc ?? null);

    carregarFornecedores(false);
  }

  const salvar = async (event: FormEvent) => {
    event.preventDefault();

    if (documentoFornecedor !== null && !validaCNPJ(documentoFornecedor)) {
      alertarMensagemSistema("warning", "Documento do fornecedor é invalido!");
      document.getElementById("frn_doc")?.focus();
      return;
    }

    processarFormulario(true);

    const status: retornoRequisicaoProps = tokenFornecedor
      ? await atualizaDadosFornecedor(
          nomeFornecedor,
          tokenFornecedor,
          documentoFornecedor
        )
      : await cadastraFornecedor(nomeFornecedor, documentoFornecedor);

    alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    limparCampos();
    processarFormulario(false);
    listarFornecedores();
  };

  useEffect(() => {
    listarFornecedores();
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
      {mensagemAlerta !== null ? (
        <div className="row">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <form onSubmit={salvar} className="row g-2">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="frn_nome"
                placeholder="Nome ou Razão Social"
                disabled={processandoFormulario}
                value={nomeFornecedor ?? ""}
                required
                onChange={(event) => {
                  setarNomeFornecedor(event.target.value);
                }}
              />
              <label htmlFor="frn_nome">Nome do fornecedor</label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="frn_doc"
                placeholder="Documento fornecedor"
                disabled={processandoFormulario}
                value={documentoFornecedor ?? ""}
                maxLength={18}
                onChange={(event) => {
                  mascararCnpj(event.target.value);
                }}
              />
              <label htmlFor="frn_doc">CNPJ do fornecedor</label>
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
                onClick={limparCampos}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="row">
        <div className="col-12">
          <TabelaFornecedor
            listaFornecedores={listaFornecedores}
            carregandoLista={carregandoFornecedor}
            processandoRequisicao={processandoRequisicao}
            editar={(id) => editarFornecedor(id)}
          />
        </div>
      </div>
    </>
  );
};

export default Fornecedor;
