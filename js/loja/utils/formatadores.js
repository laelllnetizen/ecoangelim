export function formatarNumero(numero) {
  return new Intl.NumberFormat("pt-BR").format(numero);
}
