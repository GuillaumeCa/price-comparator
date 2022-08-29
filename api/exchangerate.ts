import dayjs from "dayjs";

export type CurrentRatesResponse = {
  rates: { [key: string]: number };
};

export type RangeRateResponse = {
  rates: { [key: string]: { EUR: number } };
};

export function dateToDateKey(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

export async function fetchCurrentRates(): Promise<CurrentRatesResponse> {
  const res = await fetch(
    "https://api.exchangerate.host/latest?symbols=EUR,USD&base=USD"
  );
  return res.json();
}

export async function fetchRatesAtDate(
  date: string
): Promise<CurrentRatesResponse> {
  const res = await fetch(
    `https://api.exchangerate.host/${date}?symbols=EUR,USD&base=USD`
  );
  return res.json();
}

export async function fetchRatesRange(
  startDate: string,
  endDate: string
): Promise<RangeRateResponse> {
  let days = dayjs(endDate).diff(startDate, "day");
  let newStart = startDate;
  let newEnd = endDate;
  const requests = [];
  while (days > 300) {
    newEnd = dateToDateKey(dayjs(newStart).add(300, "day").toDate());
    requests.push(fetchSingleRateRange(newStart, newEnd));
    newStart = newEnd;
    days = dayjs(endDate).diff(newStart, "day");
  }
  requests.push(fetchSingleRateRange(newStart, endDate));
  const res = await Promise.all(requests);

  return res.reduce(
    (prev, current) => {
      return { rates: { ...prev.rates, ...current.rates } };
    },
    { rates: {} }
  );
}

async function fetchSingleRateRange(
  startDate: string,
  endDate: string
): Promise<RangeRateResponse> {
  const res = await fetch(
    `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&symbols=EUR&base=USD`
  );
  return res.json();
}
