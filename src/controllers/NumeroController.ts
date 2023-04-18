export function formataValorMoedaBrasileira(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function removeFormatoMoedaBrasileira(valor: string): number {
  return parseFloat(valor.replace(/[^0-9,-]/g, "").replace(",", "."));
}

export function adicionaMascaraValor(valor: string): string {
  const valorNumber: number = parseFloat(valor.replace(",", "."));

  return !isNaN(valorNumber)
    ? valorNumber.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";
}

export function calculaPorcentagemLucroProduto(
  precoVenda: number = 0,
  valorCompra: number = 0
): number {
  console.log(precoVenda);
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
