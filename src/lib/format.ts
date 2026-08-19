const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const currencyExact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatCurrencyExact(value: number): string {
  return currencyExact.format(value);
}

export function formatPercent(value: number): string {
  return `${percent.format(value)}%`;
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}
