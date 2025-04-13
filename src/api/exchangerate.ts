import { getRates, getRatesAtDate } from "./get-rates";

export type CurrentRatesResponse = {
  rates: { USD: number };
};

export async function fetchCurrentRates(): Promise<CurrentRatesResponse> {
  const rates = await getRates("EUR", "USD", "week");

  return {
    rates: { USD: rates.data.CurrentInterbankRate },
  };
}

export async function getRateAtDate(date: Date) {
  const rates = await getRatesAtDate(date);

  if (rates) {
    return 1 / rates.usd;
  }

  return 0.0;
}
