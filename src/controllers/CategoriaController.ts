import { categoriaProps } from "./../interfaces/interfaceCategoria";
import instanciaAxios from "../libraries/AxiosInstance";
import { retornoRequisicaoProps } from "../interfaces/interfaceReturnoRequisicao";

export async function buscarListaCategoria(): Promise<categoriaProps[]> {
  return await instanciaAxios
    .get<categoriaProps[]>("categoria/listar")
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}

export async function cadastrarCategoria(
  nomeCategoria: string
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .post<retornoRequisicaoProps>(
      "categoria/cadastrar",
      JSON.stringify({
        nomeCategoria: nomeCategoria,
      })
    )
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return {
        status: false,
        msg: "Erro ao processar requisição!",
      };
    });
}

export async function atualizarCategoria(
  nomeCategoria: string,
  tokenCategoria: string
): Promise<retornoRequisicaoProps> {
  return await instanciaAxios
    .patch<retornoRequisicaoProps>(
      "categoria/editar",
      {
        tokenCategoria: tokenCategoria,
        nomeCategoria: nomeCategoria,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return {
        status: false,
        msg: "Erro ao processar requisição!",
      };
    });
}
