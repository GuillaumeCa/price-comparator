import { asc, eq, gte } from "drizzle-orm";
import { db } from "../db";
import { ratesTable } from "../db/schema";

const BASE_URL_YAHOO =
  "https://api.rates-history-service.prd.aws.ofx.com/rate-history/api/1";

export interface RatesAPIResponse {
  data: {
    CurrentInterbankRate: number;
    CurrentInverseInterbankRate: number;
    Average: number;
    HistoricalPoints: HistoricalPoint[];
    supportedByOfx: boolean;
    fetchTime: number;
  };
}

export interface HistoricalPoint {
  PointInTime: number;
  InterbankRate: number;
  InverseInterbankRate: number;
}

export function getRates(
  base: string,
  term: string,
  period: "week" | "mont" | "allTime"
): Promise<RatesAPIResponse> {
  return fetch(BASE_URL_YAHOO, {
    method: "POST",
    body: JSON.stringify({
      method: "spotRateHistory",
      data: {
        base,
        term,
        period,
      },
    }),
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    },
  }).then(async (res) => {
    if (!res.ok) {
      console.log("request failed: ", res.statusText);
      throw new Error("Failed to get rates");
    }

    return res.json();
  });
}

export function getRatesAtDate(date: Date) {
  return db
    .select({
      usd: ratesTable.usd,
    })
    .from(ratesTable)
    .where(eq(ratesTable.date, date))
    .get();
}

export function getHistoricRatesFromDate(date: Date) {
  console.log(date);
  return db
    .select({
      date: ratesTable.date,
      usd: ratesTable.usd,
    })
    .from(ratesTable)
    .where(gte(ratesTable.date, date))
    .orderBy(asc(ratesTable.date))
    .all();
}
