import { db } from "..";
import { productsTable } from "../schema";

async function seedProducts() {
  await db.insert(productsTable).values([
    {
      name: "iPhone 16",
      currency: "USD",
      currency_compare: "EUR",
      fixed_tax: 0,
      release_date: new Date(2024, 8, 20).toISOString(),
      release_price: 799,
      release_price_compare: 969,
    },
    {
      name: "Macbook Pro 14 M4",
      currency: "USD",
      currency_compare: "EUR",
      fixed_tax: 0,
      release_date: new Date(2024, 10, 1).toISOString(),
      release_price: 1599,
      release_price_compare: 1899,
    },
  ]);
}

seedProducts();
