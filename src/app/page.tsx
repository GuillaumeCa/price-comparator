"use server";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchCurrentRates } from "../api/exchangerate";
import { fetchProducts } from "../api/products";
import { Products } from "./Products";
dayjs.extend(relativeTime);

export default async function Home() {
  const currentRates = await fetchCurrentRates();
  const products = await fetchProducts();

  return (
    <div>
      <Products products={products} currentRates={currentRates} />
    </div>
  );
}
