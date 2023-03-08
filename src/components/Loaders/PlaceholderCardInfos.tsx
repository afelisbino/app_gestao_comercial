import { useId } from "react";

export function PlaceholderCardInfos() {
  const idCard = useId();

  return (
    <div
      id={idCard}
      className={"text-light-dark card mx-1 mb-3 shadow"}
      style={{ width: "18rem" }}
    >
      <div className="card-header">
        <p className="placeholder-wave">
          <span className="placeholder text-muted col-12 placeholder-lg rounded-4"></span>
        </p>
      </div>
      <div className="card-body">
        <h4 className="card-title placeholder-wave">
          <span className="placeholder col-6 placeholder-lg rounded-4"></span>
        </h4>
      </div>
    </div>
  );
}
