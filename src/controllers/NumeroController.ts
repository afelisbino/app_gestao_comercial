export function mascaraValorMoedaBrasileira(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function removeMascaraMoedaBrasileira(valor: string): number {
    return parseFloat(valor.replace(/[^0-9,-]/g, '').replace(',', '.'));
}

export function formatarValorMoeda(valor: string): string {
    return valor.replace(",", ".");
}