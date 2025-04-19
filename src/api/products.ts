import { eq, isNull, or } from "drizzle-orm";
import { auth } from "../app/auth";
import { db } from "../db";
import { productsTable, SelectProduct } from "../db/schema";
import { getRateAtDate } from "./exchangerate";

export interface ProductWithRates {
  product: SelectProduct;
  rates: {
    EUR: number;
  };
}

export async function fetchProducts(): Promise<ProductWithRates[]> {
  const session = await auth();
  const userId = session?.user.id;
  const products = await db
    .select()
    .from(productsTable)
    .where(
      userId
        ? or(eq(productsTable.user_id, userId), isNull(productsTable.user_id))
        : isNull(productsTable.user_id)
    );

  if (!products) {
    return [];
  }

  const newProducts: ProductWithRates[] = [];
  for (const product of products) {
    const productWithRates: ProductWithRates = {
      product,
      rates: { EUR: 0 },
    };
    const releaseDate = new Date(product.release_date);

    productWithRates.rates.EUR = await getRateAtDate(releaseDate);
    newProducts.push(productWithRates);
  }

  return newProducts;
}

export function insertProduct(product: typeof productsTable.$inferInsert) {
  return db.insert(productsTable).values(product);
}
