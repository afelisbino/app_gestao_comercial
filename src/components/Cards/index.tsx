import { useId } from "react";

interface infoProps {
  nome: string;
  cor?: string | null;
  valor: string | number | null;
}

export function Cards({ nome, valor, cor }: infoProps) {
  const idCard = useId();

  return (
    <div
      key={idCard}
      className={(cor ?? "text-bg-dark") + " card mx-1 mb-3 shadow"}
      style={{ width: "18rem" }}
    >
      <div className="card-header fw-bold">{nome}</div>
      <div className="card-body">
        <h2 className="card-title">{valor}</h2>
      </div>
    </div>
  );
}
