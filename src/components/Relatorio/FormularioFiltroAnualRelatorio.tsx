import { FormEvent, useRef } from "react";
import { filtroRelatorioProps } from "../../interfaces/interfaceFiltroRelatorio";

export function FormularioFiltroAnualRelatorio({
  filtrandoRelatorio,
  filtrarRelatorio,
  alertarMensagem,
}: filtroRelatorioProps) {
  const dataInicioRef = useRef<HTMLInputElement>(null);
  const dataFimRef = useRef<HTMLInputElement>(null);

  const processarFiltro = (event: FormEvent) => {
    event.preventDefault();

    let dataInicio = dataInicioRef?.current?.value;
    let dataFim = dataFimRef?.current?.value;

    if (
      dataInicio == null ||
      dataFim == null ||
      parseInt(dataInicio) > parseInt(dataFim)
    ) {
      alertarMensagem(
        "warning",
        "O ano inicial não pode ser maior que o ano final!"
      );
      
      return;
    }

    filtrarRelatorio(dataInicio ?? null, dataFim ?? null);

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
            type="text"
            autoComplete="off"
            className="form-control"
            ref={dataInicioRef}
            key={self.crypto.randomUUID()}
            disabled={filtrandoRelatorio}
            required
            placeholder="Ano inicial"
          />
          <label htmlFor="dataInicio">Ano inicial</label>
        </div>
      </div>
      <div className="col-12 col-lg-4 col-md-4">
        <div className="form-floating">
          <input
            type="text"
            autoComplete="off"
            className="form-control"
            ref={dataFimRef}
            key={self.crypto.randomUUID()}
            disabled={filtrandoRelatorio}
            required
            placeholder="Ano final"
          />
          <label htmlFor="dataFim">Ano final</label>
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
