import { alertaProps } from "../../interfaces/interfaceAlerta";

export function Alerta({ tipo, mensagem }: alertaProps) {
  return (
    <div
      className={"alert alert-" + tipo + " alert-dismissible fade show text-center"}
      role="alert"
      id="alertaApp"
    >
      {mensagem}
    </div>
  );
}
