import { produtoAtivosProps } from './../interfaces/interfaceProdutosAtivos';
import { retornoRequisicaoProps } from './../interfaces/interfaceReturnoRequisicao';
import { produtoProps } from './../interfaces/interfaceProdutos';
import instanciaAxios from "../libraries/AxiosInstance";
import { codigoBarrasProps } from '../interfaces/interfaceCodigoBarrasProduto';
import { historicoEstoqueEmpresaProps, historicoProdutoEstoqueProps } from '../interfaces/interfaceHistoricoEstoqueEmpresa';

export async function buscarListaTodosProdutos(): Promise<produtoProps[]> {

    return instanciaAxios
        .get<produtoProps[]>("produto/listar/todos")
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });

}

export async function cadastrarProduto(dadosParametros: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios
        .post<retornoRequisicaoProps>(
            "produto/cadastrar",
            dadosParametros
        )
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return { status: false, msg: "Erro ao processar, tente novamente!" }
        });

}

export async function alterarProduto(dadosParametros: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios
        .put<retornoRequisicaoProps>(
            "produto/alterar",
            dadosParametros
        )
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return { status: false, msg: "Erro ao processar, tente novamente!" }
        });
}

export async function ativarProduto(tokenProduto: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios.patch<retornoRequisicaoProps>("produto/ativar", { "tokenProduto": tokenProduto }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}

export async function desativarProduto(tokenProduto: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios.patch<retornoRequisicaoProps>("produto/desativar", { "tokenProduto": tokenProduto }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}

export async function buscarListaCodigoBarrasProduto(tokenProduto: string): Promise<codigoBarrasProps[]> {
    return instanciaAxios.get<codigoBarrasProps[]>("produto/codigo_barras/listar", {
        params: {
            "tokenProduto": tokenProduto
        }
    }).then(({ data }) => { return data }).catch((error) => {
        console.log(error);
        return [];
    });
}

export async function adicionarNovoCodigoBarrasProduto(tokenProduto: string, codigoBarras: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios.post<retornoRequisicaoProps>('produto/codigo_barras/adicionar',
        {
            tokenProduto: tokenProduto,
            codigoBarrasProduto: codigoBarras
        }).then(
            ({ data }) => { return data }
        ).catch((error) => {
            console.log(error);
            return { status: false, msg: "Erro ao processar, tente novamente!" }
        });
}

export async function deletarCodigoBarrasProduto(tokenCodigoBarras: string): Promise<retornoRequisicaoProps> {
    return instanciaAxios.delete<retornoRequisicaoProps>('produto/codigo_barras/remover', {
        data: {
            tokenCodigo: tokenCodigoBarras
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then(
        ({ data }) => { return data }
    ).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}

export async function buscarListaHistoricoEstoque(dataInicio: string | null, dataFim: string | null): Promise<historicoEstoqueEmpresaProps[]> {
    return instanciaAxios.get("estoque/historico/todos", {
        params: {
            dataInicio: dataInicio,
            dataFim: dataFim
        }
    }).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return [];
    })
}

export async function buscarListaHistoricoProduto(pro_id: string): Promise<historicoProdutoEstoqueProps[]> {
    return instanciaAxios.get("estoque/historico/produto", {
        params: {
            tokenProduto: pro_id
        }
    }).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return [];
    })
}

export async function buscarListaProdutoAtivo(): Promise<produtoAtivosProps[]> {

    return instanciaAxios.get("produto/listar/ativos").then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return [];
    })
}

