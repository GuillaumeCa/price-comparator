import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { getHistoricRatesFromDate } from "../../../api/get-rates";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");

  if (date) {
    const rates = await getHistoricRatesFromDate(dayjs(date).toDate());

    return Response.json(rates);
  }

  return Response.error();
}
