import { retornoRequisicaoProps } from "../interfaces/interfaceReturnoRequisicao";
import instanciaAxios from "../libraries/AxiosInstance";

export async function registraMovimentacao(
  mcxValor: number,
  mcxTipo: string,
  mcxComentario: string | null,
  mcxData: string | null
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post<retornoRequisicaoProps>(
      "caixa/registrar/movimentacao",
      JSON.stringify({
        mcxTipo: mcxTipo,
        mcxValor: mcxValor,
        mcxComentario: mcxComentario,
        mcxData: mcxData,
      })
    )
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return { status: false, msg: "Erro ao processar, tente novamente!" };
    });
}
