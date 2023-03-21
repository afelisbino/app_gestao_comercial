export interface estatisticaFechamentoCaixa {
    data: string;
    valorFechamento: number;
}

export interface estatisticaCaixa {
    valorTotalReceita: number;
    valorTotalLucro: number;
    porcentagemTotalLucro:number;
    valorTotalEntrada: number;
    valorTotalSaida: number;
}

export interface estatisticaReceitaLucro {
    data: string;
    valorReceita: number;
    valorLucro: number;
    porcentagemLucro: number;
}

export interface estatisticaMovimentacaoCaixa {
    data: string;
    valorEntrada: number;
    valorSaida: number;
}

export interface relatorioCaixa {
    resumo: estatisticaCaixa;
    fechamento: estatisticaFechamentoCaixa[];
    valoresReceitaLucro: estatisticaReceitaLucro[];
    valoresMovimentacoes: estatisticaMovimentacaoCaixa[];
}