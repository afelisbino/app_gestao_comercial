import { retornoRequisicaoProps } from './../interfaces/interfaceReturnoRequisicao';
import { sacolaProp } from './../interfaces/interfaceSacola';
import instanciaAxios from "../libraries/AxiosInstance";
import { itensVendaProps, vendaFiadoProps } from '../interfaces/interfaceVenda';

interface formaPagamentoProps {
    valor: string;
    nome: string;
}

export const tiposPagamentos: formaPagamentoProps[] = [
    {
        valor: 'dinheiro',
        nome: 'Dinheiro'
    },
    {
        valor: 'cartao',
        nome: 'Cartão'
    },
    {
        valor: 'pix',
        nome: 'Pix'
    }
];

export async function finalizarVendaLocalNormal(totalCompra: number, valorDesconto: number, itensSacola: sacolaProp[], tipoPagamento?: string): Promise<retornoRequisicaoProps> {
    return await instanciaAxios.post<retornoRequisicaoProps>('venda/registrar/local/normal',
        JSON.stringify({
            vendaValorCompra: totalCompra,
            vendaValorDesconto: valorDesconto,
            itens: itensSacola,
            vendaTipoPagamento: tipoPagamento ?? null
        })
    ).then(({ data }) => { return data }).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}

export async function finalizarVendaLocalFiado(totalCompra: number, nomeCliente: string, itensSacola: sacolaProp[]): Promise<retornoRequisicaoProps> {
    return await instanciaAxios.post<retornoRequisicaoProps>('venda/registrar/local/fiado',
        JSON.stringify({
            vendaValorCompra: totalCompra,
            vendaValorDesconto: 0,
            nomeCliente: nomeCliente,
            itens: itensSacola,
            vendaTipoPagamento: null
        })
    ).then(({ data }) => { return data }).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}

export async function listaVendaFiadoAberto(): Promise<vendaFiadoProps[]> {
    return await instanciaAxios.get('venda/listar/fiado').then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return [];
    });
}

export async function listaItensVenda(tokenVenda: string): Promise<itensVendaProps[]> {
    return await instanciaAxios.get('venda/listar/itens', {
        params: {
            tokenVenda: tokenVenda
        }
    }).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return [];
    });
}

export async function processaPagamentoVendaFiado(tokenVenda: string, tipoPagamento: string): Promise<retornoRequisicaoProps> {
    return await instanciaAxios.patch(
        "venda/fiado/pagar",
        {
            "tokenVenda": tokenVenda,
            tipoPagamento: tipoPagamento
        },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    ).then(({ data }) => {
        return data;
    }).catch((error) => {
        console.log(error);
        return { status: false, msg: "Erro ao processar, tente novamente!" }
    });
}