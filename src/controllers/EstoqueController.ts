import { estatisticasEstoqueProps, estoqueProps } from "../interfaces/interfaceEstoque";
import { retornoRequisicaoProps } from "../interfaces/interfaceReturnoRequisicao";

import instanciaAxios from "../libraries/AxiosInstance";

export async function buscaListaProdutosEstoque(): Promise<estoqueProps[]> {
    return await instanciaAxios
        .get<estoqueProps[]>("relatorio/estoque/listar")
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
}

export async function registraSaidaProdutoEstoque(pro_id: string, quantidade: number): Promise<retornoRequisicaoProps> {
    return await instanciaAxios
        .patch<retornoRequisicaoProps>("estoque/saida", {
            "tokenProduto": pro_id,
            "quantidadeSaida": (quantidade * (-1))
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        .then(({ data }) => { return data; })
        .catch((error) => {
            console.log(error);
            return { status: false, msg: "Falha ao processar o registro de saida de estoque" };
        });
}

export async function registraEntradaProdutoEstoque(pro_id: string, quantidade: number): Promise<retornoRequisicaoProps> {
    return await instanciaAxios
        .patch<retornoRequisicaoProps>("estoque/entrada", {
            "tokenProduto": pro_id,
            "quantidadeEntrada": quantidade
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        .then(({ data }) => { return data; })
        .catch((error) => {
            console.log(error);
            return { status: false, msg: "Falha ao processar o registro de entrada de estoque" };
        });
}

export async function buscaEstatisticasEstoque(dataInicio: string | null, dataFim: string | null): Promise<estatisticasEstoqueProps> {
    return instanciaAxios.get<estatisticasEstoqueProps>("relatorio/estoque/estatisticas", {
        params: {
            dataInicio: dataInicio,
            dataFim: dataFim
        }
    })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return {
                quantidade_estoque: 0,
                quantidade_estoque_zerado: 0,
                quantidade_estoque_desativado: 0,
                quantidade_estoque_minimo: 0,
                produtos_vendidos: [],
                quantidade_movimentacoes: []
            };
        })
}