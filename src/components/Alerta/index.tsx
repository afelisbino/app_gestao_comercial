import { useId } from "react";
import { alertaProps } from "../../interfaces/interfaceAlerta";

export function Alerta({ tipo, mensagem }: alertaProps) {
  const telaId = useId();

  return (
    <div
      className={
        "alert alert-" + tipo + " alert-dismissible fade show text-center shadow"
      }
      role="alert"
      key={telaId}
    >
      {mensagem}
    </div>
  );
}
