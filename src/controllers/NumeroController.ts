export function mascaraValorMoedaBrasileira(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function removeMascaraMoedaBrasileira(valor: string): number {
  return parseFloat(valor.replace(/[^0-9,-]/g, "").replace(",", "."));
}

export function formataValorMoeda(valor: string): string {
  return valor.replace(",", ".");
}

export function calculaPorcentagemLucroProduto(
  precoVenda: number = 0,
  valorCompra: number = 0
): number {
  return precoVenda > 0 && valorCompra > 0
    ? ((precoVenda - valorCompra) / precoVenda) * 100
    : 0;
}

export function calculaValorLucroProduto(
  precoVenda: number = 0,
  valorCompra: number = 0
): number {
  return precoVenda > 0 && valorCompra > 0 ? precoVenda - valorCompra : 0;
}
