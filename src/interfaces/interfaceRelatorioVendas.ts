export interface estatisticaVendas {
    qtdTotalVendas: number;
    valorTotalVendas: number;
    valorTotalLucro: number;
    porcentagemTotalLucro: number;
    estatisticasVenda: estatisticaVendasUltimosSeteDias[];
}

export interface estatisticaVendasUltimosSeteDias {
    dataLabel: string;
    totalFiado: number;
    totalNormal: number;
    totalCartao: number;
    totalDinheiro: number;
    totalPix: number;
    valorTotalVendas: number;
    valorTotalGanhos: number;
    valorTotalCartao: number;
    valorTotalDinheiro: number;
    valorTotalPix: number;
}

export interface vendasFinalizadaProps {
    ven_id: string;
    ven_data: string;
    ven_tipo: string;
    ven_pagamento: string;
    ven_valor_compra: number;
    ven_desconto: number;
    ven_total: number;
    ven_lucro: number;
    ven_porcentagem_lucro: number;
}