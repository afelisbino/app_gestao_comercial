import { FormEvent, useState } from "react";
import { registraMovimentacao } from "../../controllers/MovimentacaoCaixaController";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { formataValorMoeda } from "../../controllers/NumeroController";

const MovimentacaoManual = () => {
  const [processandoFormulario, processsarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [movimentacaoData, setarMovimentacaoData] = useState<Date | null>(null);
  const [movimentacaoValor, setarMovimentacaoValor] = useState<string>("");
  const [movimentacaoTipo, selecionarMovimentacaoTipo] = useState<string>("");
  const [movimentacaoComentario, setarMovimentacaoComentario] =
    useState<string>("");

  function limparCampos() {
    setarMovimentacaoValor("");
    selecionarMovimentacaoTipo("");
    setarMovimentacaoComentario("");
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function salvarMovimentacaoCaixa(event: FormEvent) {
    event.preventDefault();

    processsarFormulario(true);

    const status: retornoRequisicaoProps = await registraMovimentacao(
      parseFloat(movimentacaoValor),
      movimentacaoTipo,
      movimentacaoComentario,
      movimentacaoData?.toISOString() ?? null
    );

    alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    limparCampos();
    processsarFormulario(false);
  }

  return (
    <>
      {processandoFormulario ? (
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
      <form onSubmit={salvarMovimentacaoCaixa}>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12 gap-1">
            <div className="form-floating">
              <input
                type="text"
                autoComplete="off"
                className="form-control"
                id="mcxValor"
                required
                placeholder="Valor"
                value={movimentacaoValor}
                onChange={(event) => {
                  setarMovimentacaoValor(formataValorMoeda(event.target.value));
                }}
              />
              <label htmlFor="mcxValor">Valor</label>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 gap-1">
            <div className="form-floating">
              <select
                className="form-select"
                id="mcxTipo"
                required
                aria-label="Tipo da movimentação"
                value={movimentacaoTipo}
                onChange={(event) => {
                  selecionarMovimentacaoTipo(event.target.value);
                }}
              >
                <option selected disabled value={""}>
                  Selecione
                </option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saida</option>
              </select>
              <label htmlFor="mcxTipo">Tipo de movimentação</label>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 gap-1">
            <div className="form-floating">
              <input
                type="date"
                autoComplete="off"
                className="form-control"
                id="mcxData"
                placeholder="Data da movimentação"
                onChange={(event) => {
                  setarMovimentacaoData(event.target.valueAsDate);
                }}
              />
              <label htmlFor="mcxData">Data da movimentação</label>
            </div>
          </div>
          <div className="col-12 gap-1">
            <div className="form-floating mt-2">
              <textarea
                className="form-control"
                placeholder="Motivo da movimentação"
                autoComplete="off"
                id="mcxComentario"
                style={{ height: "100px" }}
                value={movimentacaoComentario}
                onChange={(event) => {
                  setarMovimentacaoComentario(event.target.value);
                }}
              ></textarea>
              <label htmlFor="mcxComentario">Motivo da movimentação</label>
            </div>
          </div>
        </div>
        <div className="row mt-3">
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
        <hr />
      </form>
    </>
  );
};

export default MovimentacaoManual;
