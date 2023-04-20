import { FormEvent, useRef } from "react";
import { filtroRelatorioProps } from "../../interfaces/interfaceFiltroRelatorio";

export function FormularioFiltroDiarioRelatorio({
  filtrandoRelatorio,
  filtrarRelatorio,
  alertarMensagem,
}: filtroRelatorioProps) {
  const dataInicioRef = useRef<HTMLInputElement>(null);
  const dataFimRef = useRef<HTMLInputElement>(null);

  const processarFiltro = (event: FormEvent) => {
    event.preventDefault();

    let dataInicio = dataInicioRef?.current?.valueAsDate;
    let dataFim = dataFimRef?.current?.valueAsDate;

    if (dataInicio == null || dataFim == null || dataInicio > dataFim) {
      alertarMensagem(
        "warning",
        "A data inicial não pode ser maior que a data final!"
      );

      return;
    }

    filtrarRelatorio(
      dataInicio.toISOString() ?? null,
      dataFim.toISOString() ?? null
    );

    if (dataInicioRef.current) dataInicioRef.current.value = "";
    if (dataFimRef.current) dataFimRef.current.value = "";
  };

  return (
    <form
      onSubmit={processarFiltro}
      className="row justify-content-lg-center gap-2 mt-2"
    >
      <div className="col-12 col-lg-4 col-md-4">
        <div className="form-floating">
          <input
            type="date"
            autoComplete="off"
            className="form-control"
            ref={dataInicioRef}
            key={self.crypto.randomUUID()}
            disabled={filtrandoRelatorio}
            required
            placeholder="Data inicial"
          />
          <label htmlFor="dataInicio">Data inicial</label>
        </div>
      </div>
      <div className="col-12 col-lg-4 col-md-4">
        <div className="form-floating">
          <input
            type="date"
            autoComplete="off"
            className="form-control"
            ref={dataFimRef}
            key={self.crypto.randomUUID()}
            disabled={filtrandoRelatorio}
            required
            placeholder="Data final"
          />
          <label htmlFor="dataFim">Data final</label>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 d-grid">
        {filtrandoRelatorio ? (
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
            Buscando...
          </button>
        ) : (
          <button type="submit" className="btn btn-success btn-lg shadow">
            Buscar
          </button>
        )}
      </div>
    </form>
  );
}
