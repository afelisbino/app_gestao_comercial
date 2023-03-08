import { FormEvent, useEffect, useState } from "react";
import { Alerta } from "../Alerta";
import { fornecedorProps } from "../../interfaces/interfaceFornecedor";
import { TabelaFornecedor } from "./TabelaFornecedor";
import instanciaAxios from "../../libraries/AxiosInstance";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { Spinner } from "../Loaders/Spinner";

export function Fornecedores() {
  const [processandoRequisicao, processarRequisicao] = useState(false);
  const [carregandoFornecedor, carregarFornecedores] = useState(false);
  const [processandoFormulario, processarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [nomeFornecedor, setarNomeFornecedor] = useState<string | null>(null);
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
    setarNomeFornecedor(null);
    setarDocumentoFornecedor(null);
  }

  function editarFornecedor(id: string) {
    buscarDadosFornecedor(id);
  }

  async function excluirFornecedor(id: string) {
    processarRequisicao(true);

    await instanciaAxios
      .delete("fornecedor/excluir", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          tokenFornecedor: id,
        },
      })
      .then(({ data }) => {
        if (data.status) {
          alertarMensagemSistema("success", data.msg);
          buscarListaFornecedores();
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

  function validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    let tamanho: any = cnpj.length - 2;
    let numeros: any = cnpj.substring(0, tamanho);
    let digitos: any = cnpj.substring(tamanho);
    let soma: any = 0;
    let pos: any = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }

  function mascararCnpj(documento: string) {
    documento = documento.replace(/^(\d{2})(\d)/, "$1.$2");
    documento = documento.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    documento = documento.replace(/\.(\d{3})(\d)/, ".$1/$2");
    documento = documento.replace(/(\d{4})(\d)/, "$1-$2");

    setarDocumentoFornecedor(documento);
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();

    processarFormulario(true);

    if (documentoFornecedor !== null && !validarCNPJ(documentoFornecedor)) {
      processarFormulario(false);
      alertarMensagemSistema("warning", "Documento do fornecedor é invalido!");
      document.getElementById("frn_doc")?.focus();
      return;
    }

    if (tokenFornecedor === null) {
      cadastrar();
    } else {
      alterar();
    }
  }

  async function buscarListaFornecedores() {
    carregarFornecedores(true);

    await instanciaAxios
      .get<fornecedorProps[]>("fornecedor/listar")
      .then(({ data }) => {
        setarListaFornecedores(data);
      })
      .finally(() => carregarFornecedores(false));
  }

  async function cadastrar() {
    await instanciaAxios
      .post<retornoRequisicaoProps>("fornecedor/cadastrar", {
        nomeFornecedor: nomeFornecedor,
        documentoFornecedor: documentoFornecedor,
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
          "Houve um erro durante o processamento, tente novamente!"
        );

        console.log(error);
      })
      .finally(() => {
        processarFormulario(false);
        limparCampos();
        buscarListaFornecedores();
      });
  }

  async function alterar() {
    processarRequisicao(true);

    await instanciaAxios
      .put<retornoRequisicaoProps>(
        "fornecedor/editar",
        {
          nomeFornecedor: nomeFornecedor,
          documentoFornecedor: documentoFornecedor,
          tokenFornecedor: tokenFornecedor,
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
          "Houve um erro durante o processamento, tente novamente!"
        );

        console.log(error);
      })
      .finally(() => {
        processarFormulario(false);
        limparCampos();
        buscarListaFornecedores();
      });
  }

  async function buscarDadosFornecedor(idFornecedor: string) {
    processarRequisicao(true);
    await instanciaAxios
      .get<fornecedorProps>("fornecedor/buscar", {
        params: {
          tokenFornecedor: idFornecedor,
        },
      })
      .then(({ data }) => {
        if (data) {
          setarNomeFornecedor(data.frn_nome);
          setarTokenFornecedor(data.frn_id);

          if (data.frn_doc) mascararCnpj(data.frn_doc);
        }
      })
      .catch((error) => {
        alertarMensagemSistema(
          "danger",
          "Houve um erro durante o processamento, tente novamente!"
        );

        console.log(error);
      })
      .finally(() => processarRequisicao(false));
  }

  useEffect(() => {
    buscarListaFornecedores();
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
      <form onSubmit={salvar} className="row mt-5 g-2">
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
            excluir={(id) => excluirFornecedor(id)}
          />
        </div>
      </div>
    </>
  );
}
