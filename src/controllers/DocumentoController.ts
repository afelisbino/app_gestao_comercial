export function validaCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  let tamanho: any = cnpj.length - 2;
  let numeros: any = cnpj.substring(0, tamanho);
  let digitos: any = cnpj.substring(tamanho);
  let soma: any = 0;
  let pos: any = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

export function mascararCnpj(documento: string): string {
  documento = documento.replace(/^(\d{2})(\d)/, "$1.$2");
  documento = documento.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  documento = documento.replace(/\.(\d{3})(\d)/, ".$1/$2");
  documento = documento.replace(/(\d{4})(\d)/, "$1-$2");

  return documento;
}
