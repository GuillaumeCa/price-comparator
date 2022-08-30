import { dateToDateKey, fetchRatesAtDate } from "./exchangerate";
import { supabase } from "./supabase";

interface Product {
  id: number;
  created_at: string;
  name: string;
  release_date: string;
  release_price: number;
  currency: "USD";
  release_price_compare: number;
  currency_compare: "EUR";
  fixed_tax: number;
  user_id: string;
}

export interface ProductWithRates extends Product {
  rates: {
    EUR: number;
  };
}

export async function fetchProducts(): Promise<ProductWithRates[]> {
  const releaseDatesRates: { [key: string]: { EUR: number } } = {};
  const { data: products, error } = await supabase
    .from<Product>("products")
    .select();

  if (!products) {
    return [];
  }

  const newProducts: ProductWithRates[] = [];
  for (const product of products) {
    const productWithRates: ProductWithRates = {
      ...product,
      rates: { EUR: 0 },
    };
    const releaseDate = new Date(product.release_date);

    const key = dateToDateKey(releaseDate);

    let rate = 0;
    if (!releaseDatesRates[key]) {
      const ratesResponse = await fetchRatesAtDate(key);
      rate = ratesResponse.rates.EUR;
    } else {
      rate = releaseDatesRates[key].EUR;
    }

    productWithRates.rates.EUR = rate;
    newProducts.push(productWithRates);
  }

  return newProducts;
}

export function insertProduct(product: Partial<Product>) {
  return supabase.from<Product>("products").insert(product);
}
