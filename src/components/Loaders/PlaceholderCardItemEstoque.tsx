import { useId } from "react";
import { PlaceholderButton } from "./PlaceholderButton";

export function PlaceholderCardItemEstoque() {
  const loaderId = useId();

  return (
    <div
      key={loaderId}
      className="card shadow border border-0 bg-light bg-gradient mt-3 mb-3"
      style={{ minWidth: "21rem", height: "auto" }}
    >
      <div className="card-header">
        <h5 className="card-title text-center">
          <p className="placeholder-wave">
            <span className="placeholder text-muted col-12 placeholder-lg rounded-4"></span>
          </p>
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="d-flex d-inline-flex justify-content-md-center">
            <div className="col-6 px-2">
              <h4 className="text-center placeholder-wave">
                <span className="placeholder text-muted col-12 placeholder-lg rounded-4"></span>
              </h4>
            </div>
            <div className="col-6 px-2">
              <h4 className="text-center placeholder-wave">
                <span className="placeholder text-muted col-12 placeholder-lg rounded-4"></span>
              </h4>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2 mt-3">
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className={"btn btn-secondary disabled placeholder col-12"}
          ></button>
        </div>
      </div>
    </div>
  );
}
