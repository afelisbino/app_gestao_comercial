import { useId } from "react";

export function ProdutosPlaceholder() {
  const idPlaceholder = useId();

  return (
    <div
      key={idPlaceholder}
      className="card border border-0 bg-light bg-gradient shadow"
      style={{ minWidth: "21rem", height: "auto" }}
    >
      <div className="card-body">
        <h5 className="card-title text-center placeholder-wave">
          <span className="placeholder col-12 placeholder-lg rounded-4"></span>
        </h5>
        <h6 className="card-subtitle mb-4 text-muted text-center placeholder-wave">
          <span className="placeholder col-6 rounded-4"></span>
        </h6>
        <div className="row">
          <div className="col-12 align-middle">
            <p className="placeholder-wave">
              <span className="placeholder col-12 placeholder-lg rounded-4"></span>
            </p>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-success disabled placeholder col-12"
          ></button>
        </div>
      </div>
    </div>
  );
}
