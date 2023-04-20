import { FormEvent, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { removeFormatoMoedaBrasileira } from "../../controllers/NumeroController";

interface formularioMovimentacaoCaixaProps {
  processandoFormulario: boolean;
  salvarMovimentacao: (
    movimentacaoValor: number,
    movimentacaoTipo: string,
    movimentacaoData: Date | null,
    movimentacaoComentario: string | null
  ) => void;
}

export function FormularioMovimentacaoManual({
  processandoFormulario,
  salvarMovimentacao,
}: formularioMovimentacaoCaixaProps) {
  const dataMovimentacaoRef = useRef<HTMLInputElement>(null);
  const comentarioMovimentacaoRef = useRef<HTMLTextAreaElement>(null);

  const [tipoMovimentacao, selecionarTipoMovimentacao] = useState<string>("");
  const [valorMovimentacao, setarValorMovimentacao] = useState<number>(0);

  function limparCampos() {
    if (dataMovimentacaoRef.current) dataMovimentacaoRef.current.value = "";
    if (comentarioMovimentacaoRef.current)
      comentarioMovimentacaoRef.current.value = "";

    setarValorMovimentacao(0);
    selecionarTipoMovimentacao("");
  }

  function enviaMovimentacao(event: FormEvent) {
    event.preventDefault();

    let dataMovimentacao = dataMovimentacaoRef?.current?.valueAsDate;
    let comentarioMovimentacao = comentarioMovimentacaoRef?.current?.value;

    salvarMovimentacao(
      valorMovimentacao,
      tipoMovimentacao,
      dataMovimentacao ?? null,
      comentarioMovimentacao ?? null
    );

    limparCampos();
  }

  return (
    <form onSubmit={enviaMovimentacao}>
      <div className="row gap-2 gap-md-0 gap-lg-0">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="form-floating">
            <select
              className="form-select"
              id="tipo-movimentacao"
              required
              aria-label="Tipo da movimentação"
              value={tipoMovimentacao}
              onChange={(event) =>
                selecionarTipoMovimentacao(event.target.value)
              }
            >
              <option selected disabled value={""}>
                Selecione
              </option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
            </select>
            <label htmlFor="tipo-movimentacao">Tipo de movimentação</label>
          </div>
        </div>
        <div className="col-12 col-md-3 col-lg-4">
          <div className="form-floating">
            <NumericFormat
              id="valor-movimentacao"
              className="form-control"
              required
              displayType="input"
              decimalSeparator={","}
              thousandSeparator={"."}
              allowLeadingZeros={true}
              prefix={"R$"}
              value={valorMovimentacao}
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              onValueChange={(value) => {
                setarValorMovimentacao(
                  removeFormatoMoedaBrasileira(
                    value.formattedValue ?? "0,00"
                  )
                );
              }}
            />
            <label htmlFor="valor-movimentacao">Valor</label>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-4">
          <div className="form-floating">
            <input
              type="date"
              autoComplete="off"
              className="form-control"
              id="data-movimentacao"
              placeholder="Data da movimentação"
              required
              ref={dataMovimentacaoRef}
            />
            <label htmlFor="data-movimentacao">Data da movimentação</label>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12">
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Motivo da movimentação"
              autoComplete="off"
              id="comentario-movimentacao"
              style={{ height: "100px" }}
              ref={comentarioMovimentacaoRef}
            ></textarea>
            <label htmlFor="comentario-movimentacao">
              Motivo da movimentação
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div className="row gap-2 gap-md-0 gap-lg-0">
        <div className="col-12 col-md-2 col-lg-2 d-grid">
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
        <div className="col-12 col-md-2 col-lg-2 d-grid">
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
    </form>
  );
}
