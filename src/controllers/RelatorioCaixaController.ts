import { relatorioCaixa } from './../interfaces/interfaceRelatorioCaixa';
import instanciaAxios from "../libraries/AxiosInstance";

export async function buscaEstatisticasCaixaPeriodo(dataInicio: string, dataFim: string): Promise<relatorioCaixa> {
    return await instanciaAxios.get<relatorioCaixa>("relatorio/caixa/periodo", {
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
                resumo: {
                    valorTotalEntrada: 0,
                    valorTotalLucro: 0,
                    valorTotalReceita: 0,
                    valorTotalSaida: 0
                }, fechamento: [{
                    data: "",
                    valorFechamento: 0
                }],
                valoresMovimentacoes: [{
                    data: "",
                    valorEntrada: 0,
                    valorSaida: 0
                }],
                valoresReceitaLucro: [{
                    data: "",
                    valorReceita: 0,
                    valorLucro: 0
                }],
            }
        });
}

export async function buscaEstatisticasCaixaMensal(mesInicio: string, mesFim: string): Promise<relatorioCaixa> {
    return await instanciaAxios.get<relatorioCaixa>("relatorio/caixa/mensal", {
        params: {
            mesInicio: mesInicio,
            mesFim: mesFim
        }
    })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return {
                resumo: {
                    valorTotalEntrada: 0,
                    valorTotalLucro: 0,
                    valorTotalReceita: 0,
                    valorTotalSaida: 0
                }, fechamento: [{
                    data: "",
                    valorFechamento: 0
                }],
                valoresMovimentacoes: [{
                    data: "",
                    valorEntrada: 0,
                    valorSaida: 0
                }],
                valoresReceitaLucro: [{
                    data: "",
                    valorReceita: 0,
                    valorLucro: 0
                }],
            }
        });
}

export async function buscaEstatisticasCaixaAnual(anoInicio: string, anoFim: string): Promise<relatorioCaixa> {
    return await instanciaAxios.get<relatorioCaixa>("relatorio/caixa/anual", {
        params: {
            anoInicio: anoInicio,
            anoFim: anoFim
        }
    })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return {
                resumo: {
                    valorTotalEntrada: 0,
                    valorTotalLucro: 0,
                    valorTotalReceita: 0,
                    valorTotalSaida: 0
                }, fechamento: [{
                    data: "",
                    valorFechamento: 0
                }],
                valoresMovimentacoes: [{
                    data: "",
                    valorEntrada: 0,
                    valorSaida: 0
                }],
                valoresReceitaLucro: [{
                    data: "",
                    valorReceita: 0,
                    valorLucro: 0
                }],
            }
        });
}