export interface filtroRelatorioProps {
  filtrandoRelatorio: boolean;
  filtrarRelatorio: (dataInicio: string, dataFim: string) => void;
  alertarMensagem: (tipo:string, mensagem: string) => void;
}
